/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { SFI_DOCUMENT_TYPES } from '@/constants/sfi/document-types.const'
import { getAppConfig } from '@/utils/get-app-config'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { CameraCapture } from '@/views/onbarding_sfi/pages/create-application.page/components/selfie/camera-capture'
import { PassportUpload } from '@/views/onbarding_sfi/pages/create-application.page/components/selfie/passport-upload'
import { useEffect } from 'react'

import { Button } from '@mui/material'
import { IdentityVerificationFormData } from './form-validate/schema'
import { useFormContext } from 'react-hook-form'

function NonIndoIdentityVerificationFormSection() {
	const appConfig = getAppConfig()
	const { control, setValue } = useFormContext<IdentityVerificationFormData>()
	const { currentIndiApp, uploadApplicationDocumentMutation } = useCustomerApplication()

	const existingDocuments = currentIndiApp?.application_documents || []

	const existingPassportFront = existingDocuments.find(
		(doc) => doc.type_id === SFI_DOCUMENT_TYPES.PASSPORT_FRONT.toString()
	)
	const existingSelfie = existingDocuments.find(
		(doc) => doc.type_id === SFI_DOCUMENT_TYPES.PASSPORT_SELFIE.toString()
	)

	useEffect(() => {
		const frontPassportPath = existingPassportFront?.path
		const selfiePath = existingSelfie?.path

		setValue('front', {
			file: null,
			previewUrl: frontPassportPath ? `${appConfig.api}/storage/${frontPassportPath}` : '',
			base64: '',
		})

		setValue('selfie', {
			file: null,
			previewUrl: selfiePath ? `${appConfig.api}/storage/${selfiePath}` : '',
			base64: '',
		})
	}, [appConfig.api, existingPassportFront?.path, existingSelfie?.path, setValue])

	const handleFileSelect = async (
		type: 'front' | 'selfie',
		data: { file: File; previewUrl: string; base64: string }
	) => {
		try {
			const typeProof =
				type === 'front'
					? SFI_DOCUMENT_TYPES.PASSPORT_FRONT.toString()
					: SFI_DOCUMENT_TYPES.PASSPORT_SELFIE.toString()

			await uploadApplicationDocumentMutation.mutateAsync({
				applicationId: currentIndiApp?.id || '',
				typeProof,
				files: [data.file],
			})

			setValue(type, data, { shouldValidate: true })
		} catch (error) {
			console.error('Upload failed:', error)
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<p className="text-mui-primary-main text-lg font-semibold">Upload Passport for verification</p>
				<p className="text-mui-text-secondary text-sm">
					Clear copies of Government issued Identity Document / Passport that contains a photo & has at least
					6 months validity
				</p>
			</div>

			{/* Upload ID Documents */}
			<div>
				<p className="text-mui-text-primary mb-4 text-base font-semibold">Upload Passport</p>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{/* Front KTP Side */}
					<PassportUpload
						name="front"
						control={control as any}
						label="Front Side"
						onFileSelect={(data) => handleFileSelect('front', data)}
						disabled={uploadApplicationDocumentMutation.isPending}
						placeholder={
							<div className="text-mui-text-secondary flex flex-col gap-1 text-xs">
								<p className="text-mui-text-secondary my-3 text-base">Front Side</p>
								<p>Supported files: .png, .jpg</p>
								<p>Maximum file size: 10.0 MB</p>
								<div className="mt-2 flex items-center justify-center gap-3">
									<Button variant="contained" disabled={uploadApplicationDocumentMutation.isPending}>
										{uploadApplicationDocumentMutation.isPending ? 'Uploading...' : 'Upload'}
									</Button>
									<CameraCapture onCapture={(data) => handleFileSelect('front', data)} />
								</div>
							</div>
						}
					/>

					{/* Selfie with ID */}
					<PassportUpload
						name="selfie"
						control={control as any}
						label="Selfie with your passport"
						onFileSelect={(data) => handleFileSelect('selfie', data)}
						disabled={uploadApplicationDocumentMutation.isPending}
						placeholder={
							<div className="text-mui-text-secondary flex flex-col gap-1 text-xs">
								<p className="text-mui-text-secondary my-3 text-base">Selfie with your passport</p>
								<p>Supported files: .png, .jpg</p>
								<p>Maximum file size: 10.0 MB</p>
								<div className="mt-2 flex items-center justify-center gap-3">
									<Button variant="contained" disabled={uploadApplicationDocumentMutation.isPending}>
										{uploadApplicationDocumentMutation.isPending ? 'Uploading...' : 'Upload'}
									</Button>
									<CameraCapture onCapture={(data) => handleFileSelect('selfie', data)} />
								</div>
							</div>
						}
					/>
				</div>
			</div>
		</div>
	)
}

export default NonIndoIdentityVerificationFormSection
