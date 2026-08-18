'use client'

import { Button } from '@mui/material'
import { Control, FieldPath } from 'react-hook-form'
import { DocumentUpload } from '@/views/onbarding_sfi/pages/create-application.page/components/document-upload'
import { CameraCapture } from '@/views/onbarding_sfi/pages/create-application.page/components/selfie/camera-capture'
import { IdentityVerificationFormData } from './form-validate/schema'

export interface VerificationDocumentData {
	file: File
	previewUrl: string
	base64: string
}

interface VerificationDocumentUploadProps {
	name: FieldPath<IdentityVerificationFormData>
	control: Control<IdentityVerificationFormData>
	label: string
	disabled: boolean
	onFileSelect: (data: VerificationDocumentData) => void
}

export default function VerificationDocumentUpload({
	name,
	control,
	label,
	disabled,
	onFileSelect,
}: VerificationDocumentUploadProps) {
	return (
		<DocumentUpload
			name={name}
			control={control}
			label={label}
			onFileSelect={onFileSelect}
			disabled={disabled}
			placeholder={
				<div className="text-mui-text-secondary flex flex-col items-center gap-1 text-xs">
					<p className="text-mui-text-secondary my-1 text-base">{label}</p>
					<p>Supported files: .png, .jpg</p>
					<p>Maximum file size: 10.0 MB</p>
					<div className="mt-2 flex items-center justify-center gap-3">
						<Button variant="contained" disabled={disabled}>
							{disabled ? 'Processing...' : 'Upload'}
						</Button>
						{!disabled && <CameraCapture onCapture={onFileSelect} />}
					</div>
				</div>
			}
		/>
	)
}
