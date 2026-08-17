/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import { Accept } from 'react-dropzone'
import FileUpload from '@/components/inputs/sfi-file-upload'

export interface RfhFileUploadProps<T extends FieldValues> {
	name: Path<T>
	control: Control<T>
	maxSize?: number
	accept?: Accept
	label?: string
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

	onFileSelect?: (data: { file: File; previewUrl: string; base64: string }) => void
	disabled?: boolean
	containerClassName?: string
	helperText?: string
}

export function RfhFileUpload<T extends FieldValues>({
	name,
	control,
	containerClassName,
	...props
}: RfhFileUploadProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => {
				// Handle both string (old) and object (new) format
				const currentFileUrl = typeof field.value === 'string' ? field.value : field.value?.previewUrl || ''

				return (
					<FileUpload
						{...props}
						currentFileUrl={currentFileUrl}
						onFileSelect={(data) => {
							// Call parent callback if provided
							props.onFileSelect?.(data)
							// Store the data object which includes file, previewUrl, and base64
							field.onChange(data)
						}}
						onRemove={() => {
							field.onChange(null)
						}}
						error={!!error}
						helperText={error?.message || props.helperText}
						containerClassName={containerClassName}
					/>
				)
			}}
		/>
	)
}

export default RfhFileUpload
