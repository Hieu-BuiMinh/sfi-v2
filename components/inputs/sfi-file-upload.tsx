/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import { Button, FormControl, FormHelperText } from '@mui/material'
import { cn } from '@/utils/cn'
import { MAX_FILE_SIZE } from '@/constants/file-upload.const'

export interface FileUploadProps {
	maxSize?: number
	accept?: Accept
	multiple?: boolean
	onFileSelect?: (data: { file: File; previewUrl: string; base64: string }) => void
	onError?: (error: string) => void
	onRemove?: () => void
	children?: (props: {
		getRootProps: () => any
		getInputProps: () => any
		isDragActive: boolean
		open: () => void
		preview: string | null
		setPreview: (url: string | null) => void
		removePreview: (e?: React.MouseEvent) => void
		error?: boolean
	}) => React.ReactNode

	label?: string
	helperText?: string
	error?: boolean
	disabled?: boolean
	currentFileUrl?: string
	showPreview?: boolean
	containerClassName?: string
}

export const FileUpload = ({
	maxSize = MAX_FILE_SIZE.medium,
	accept,
	multiple = false,
	onFileSelect,
	onError,
	onRemove,
	children,
	label,
	helperText,
	error = false,
	disabled = false,
	currentFileUrl,
	showPreview = true,
	containerClassName,
}: FileUploadProps) => {
	const [preview, setPreview] = useState<string | null>(currentFileUrl || null)

	React.useEffect(() => {
		setPreview(currentFileUrl || null)
	}, [currentFileUrl])

	const onDrop = useCallback(
		(acceptedFiles: File[], rejectedFiles: any[]) => {
			if (rejectedFiles.length > 0) {
				const rejection = rejectedFiles[0]
				if (rejection.errors[0]?.code === 'file-too-large') {
					const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
					onError?.(`File is too large. Maximum size is ${sizeMB} MB`)
				} else if (rejection.errors[0]?.code === 'file-invalid-type') {
					onError?.('Invalid file type')
				} else {
					onError?.(rejection.errors[0]?.message || 'Upload failed')
				}
				return
			}

			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0]
				const previewUrl = URL.createObjectURL(file)
				setPreview(previewUrl)

				// Convert to base64
				const reader = new FileReader()
				reader.onloadend = () => {
					const base64 = reader.result as string
					onFileSelect?.({
						file,
						previewUrl,
						base64,
					})
				}
				reader.readAsDataURL(file)
			}
		},
		[maxSize, onError, onFileSelect]
	)

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		onDrop,
		accept,
		maxSize,
		multiple,
		disabled,
	})

	const handleRemove = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		setPreview(null)
		onRemove?.()
	}

	if (children) {
		return (
			<FormControl fullWidth error={error} disabled={disabled} className={cn(containerClassName)}>
				{label && <label className="text-mui-text-secondary mb-2 text-sm font-medium">{label}</label>}
				{children({
					getRootProps,
					getInputProps,
					isDragActive,
					open,
					preview,
					setPreview,
					removePreview: handleRemove,
					error,
				})}

				<input {...getInputProps()} />
				{helperText && <FormHelperText className="mx-0 mt-2">{helperText}</FormHelperText>}
			</FormControl>
		)
	}

	return (
		<FormControl fullWidth error={error} disabled={disabled} className={cn(containerClassName)}>
			{label && <label className="text-mui-text-secondary mb-2 text-sm font-medium">{label}</label>}

			<div className="flex flex-col gap-3">
				{showPreview && preview && (
					<div className="border-mui-divider relative overflow-hidden rounded-lg border">
						<img src={preview} alt="Preview" className="h-48 w-full object-cover" />
						<button
							type="button"
							onClick={handleRemove}
							className="bg-mui-background-paper hover:bg-mui-action-hover absolute top-2 right-2 rounded-full p-2 shadow-md transition-colors"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 4L4 12M4 4L12 12"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
				)}

				<Button variant="contained" onClick={open} disabled={disabled} fullWidth>
					Upload
				</Button>
			</div>

			<input {...getInputProps()} />

			{helperText && <FormHelperText className="mx-0 mt-2">{helperText}</FormHelperText>}
		</FormControl>
	)
}

export default FileUpload
