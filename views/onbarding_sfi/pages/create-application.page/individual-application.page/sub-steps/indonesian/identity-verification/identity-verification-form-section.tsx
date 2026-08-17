/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import RfhSfiRadioGroup from '@/components/rhf-inputs/rfh-sfi-radio-group'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { SFI_DOCUMENT_TYPES } from '@/constants/sfi/document-types.const'
import { getAppConfig } from '@/utils/get-app-config'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { CameraCapture } from '@/views/onbarding_sfi/pages/create-application.page/components/selfie/camera-capture'
import { PassportUpload } from '@/views/onbarding_sfi/pages/create-application.page/components/selfie/passport-upload'
import { useEffect } from 'react'

import { Button } from '@mui/material'
import { IdentityVerificationFormData } from './form-validate/schema'
import { useFormContext } from 'react-hook-form'
import RfhSfiPatternInput from '@/components/rhf-inputs/rfh-sfi-pattern-input'

function IdentityVerificationFormSection() {
	const appConfig = getAppConfig()
	const baseImgPath = (img?: string) => (img ? `${appConfig?.api}/storage/${img}` : undefined)

	const { control, setValue, watch } = useFormContext<IdentityVerificationFormData>()
	const { currentIndiApp, uploadApplicationDocumentMutation } = useCustomerApplication()

	const verificationDocument = watch('verification_document')

	const existingDocuments = currentIndiApp?.application_documents || []

	const existingFront = existingDocuments.find((doc) => doc.type_id === SFI_DOCUMENT_TYPES.KTP_FRONT.toString())
	const existingPassportFront = existingDocuments.find(
		(doc) => doc.type_id === SFI_DOCUMENT_TYPES.PASSPORT_FRONT.toString()
	)
	const existingSelfie = existingDocuments.find(
		(doc) => doc.type_id === SFI_DOCUMENT_TYPES.PASSPORT_SELFIE.toString()
	)
	const existingNpwpPhoto = existingDocuments.find((doc) => doc.type_id === SFI_DOCUMENT_TYPES.NPWP.toString())

	useEffect(() => {
		const frontKTPPath = existingFront?.path
		const frontPassportPath = existingPassportFront?.path
		const selfiePath = existingSelfie?.path
		const npwpPath = existingNpwpPhoto?.path

		const activeFrontPath = verificationDocument === 'ktp' ? frontKTPPath : frontPassportPath
		setValue('front', {
			file: null,
			previewUrl: baseImgPath(activeFrontPath) || '',
			base64: '',
		})

		setValue('selfie', {
			file: null,
			previewUrl: baseImgPath(selfiePath) || '',
			base64: '',
		})

		setValue('npwp_photo', {
			file: null,
			previewUrl: baseImgPath(npwpPath) || '',
			base64: '',
		})
	}, [
		existingFront?.path,
		existingPassportFront?.path,
		existingSelfie?.path,
		existingNpwpPhoto?.path,
		setValue,
		verificationDocument,
	])

	const handleFileSelect = async (
		type: 'front' | 'selfie' | 'npwp',
		data: { file: File; previewUrl: string; base64: string }
	) => {
		try {
			let typeProof: string
			if (type === 'front') {
				typeProof =
					verificationDocument === 'ktp'
						? SFI_DOCUMENT_TYPES.KTP_FRONT.toString()
						: SFI_DOCUMENT_TYPES.PASSPORT_FRONT.toString()
			} else if (type === 'selfie') {
				typeProof = SFI_DOCUMENT_TYPES.PASSPORT_SELFIE.toString()
			} else {
				typeProof = SFI_DOCUMENT_TYPES.NPWP.toString()
			}

			await uploadApplicationDocumentMutation.mutateAsync({
				applicationId: currentIndiApp?.id || '',
				typeProof,
				files: [data.file],
			})

			const fieldName = type === 'front' ? 'front' : type === 'selfie' ? 'selfie' : 'npwp_photo'
			setValue(fieldName, data)
		} catch (error) {
			console.error('Upload failed:', error)
		}
	}

	const identityLabel = verificationDocument === 'ktp' ? 'KTP' : 'Passport'

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<p className="text-mui-primary-main text-lg font-semibold">Upload KTP/Passport for verification</p>
				<p className="text-mui-text-secondary text-sm">
					Clear copies of Government issued Identity Document / Passport that contains a photo & has at least
					6 months validity
				</p>
			</div>

			{/* ID Type Selection */}
			<RfhSfiRadioGroup
				name="verification_document"
				control={control}
				row
				className="gap-8"
				options={[
					{ label: 'Indonesian identity card (KTP)', value: 'ktp' },
					{ label: 'Passport', value: 'passport' },
				]}
			/>

			{/* KTP/Passport Number */}
			<div className="grid grid-cols-1 gap-4">
				<RfhSfiTextField name="ktp_or_passport" control={control} label={`${identityLabel} Number`} />
			</div>

			{/* Upload ID Documents */}
			<div>
				<p className="text-mui-text-primary mb-4 text-base font-semibold">
					Upload {verificationDocument === 'ktp' ? 'Indonesian Identity(KTP)' : 'Passport'}
				</p>

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
						label={`Selfie with your ${identityLabel}`}
						onFileSelect={(data) => handleFileSelect('selfie', data)}
						disabled={uploadApplicationDocumentMutation.isPending}
						placeholder={
							<div className="text-mui-text-secondary flex flex-col gap-1 text-xs">
								<p className="text-mui-text-secondary my-3 text-base">
									Selfie with your {identityLabel}
								</p>
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

			{/* NPWP Section */}
			<div className="mt-4 flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<p className="text-mui-primary-main text-lg font-semibold">Tax Identification Number(NPWP)</p>
					<p className="text-mui-text-secondary text-sm">NPWP consists of 15 numeric characters</p>
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<div className="col-span-1 lg:col-span-1">
						<RfhSfiPatternInput
							name="npwp_number"
							control={control}
							label="Indonesia identity number (NPWP)*"
							format="##.###.###.#-###.###"
							mask="_"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<PassportUpload
						name="npwp_photo"
						control={control as any}
						label="NPWP photo"
						onFileSelect={(data) => handleFileSelect('npwp', data)}
						disabled={uploadApplicationDocumentMutation.isPending}
						placeholder={
							<div className="text-mui-text-secondary flex flex-col gap-1 text-xs">
								<p className="text-mui-text-secondary my-3 text-base">NPWP photo</p>
								<p>Supported files: .png, .jpg</p>
								<p>Maximum file size: 10.0 MB</p>
								<div className="mt-2 flex items-center justify-center gap-3">
									<Button variant="contained" disabled={uploadApplicationDocumentMutation.isPending}>
										{uploadApplicationDocumentMutation.isPending ? 'Uploading...' : 'Upload'}
									</Button>
									<CameraCapture onCapture={(data) => handleFileSelect('npwp', data)} />
								</div>
							</div>
						}
					/>
				</div>
			</div>
		</div>
	)
}

export default IdentityVerificationFormSection
