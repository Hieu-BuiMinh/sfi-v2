/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Control } from 'react-hook-form'

import { cn } from '@/utils/cn'
import { FILE_ACCEPT_PRESETS, MAX_FILE_SIZE } from '@/constants/file-upload.const'
import RfhFileUpload from '@/components/rhf-inputs/rhf-file-upload'
import { SvgIconProps } from '@mui/material'

interface PassportUploadProps {
	name: string
	control: Control<any>
	label: string
	placeholder?: React.ReactNode
	onFileSelect?: (data: { file: File; previewUrl: string; base64: string }) => void
	disabled?: boolean
}

export const PassportUpload = ({ name, control, label, placeholder, onFileSelect, disabled }: PassportUploadProps) => {
	return (
		<RfhFileUpload
			name={name}
			control={control}
			maxSize={MAX_FILE_SIZE.medium}
			accept={FILE_ACCEPT_PRESETS.images}
			label={label}
			onFileSelect={onFileSelect}
			disabled={disabled}
		>
			{({
				getInputProps,
				getRootProps,
				isDragActive,
				preview,
				// removePreview,
				error: isError,
			}) => (
				<div
					{...getRootProps()}
					className={cn(
						'w-full cursor-pointer rounded-lg border p-8 text-center transition-colors',
						isDragActive
							? 'border-mui-primary bg-mui-primary/10'
							: isError
								? 'border-mui-error bg-mui-error/5'
								: 'border-mui-divider hover:border-mui-primary'
					)}
				>
					<input {...getInputProps()} />
					<div className="relative">
						{preview && (
							<>
								<div className="flex h-48 w-full items-center justify-center overflow-hidden rounded">
									<img src={preview} alt="Preview" className="size-full rounded object-cover" />
								</div>
							</>
						)}
						{!preview && <div className="bg-mui-action-hover h-48 w-full rounded" />}
						<div className="flex flex-col items-center gap-2">
							{placeholder || (
								<>
									<Upload className="text-mui-text-secondary" />
									<p className="text-mui-text-primary font-medium">Drag & drop your file here</p>
									<p className="text-mui-text-secondary text-sm">or click to browse</p>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</RfhFileUpload>
	)
}

const Upload = (props: SvgIconProps) => (
	<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<path
			d="M3 15V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V15"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
)
