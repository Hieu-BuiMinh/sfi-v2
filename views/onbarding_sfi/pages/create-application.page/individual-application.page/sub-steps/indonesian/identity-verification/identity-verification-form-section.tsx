'use client'

import RfhSfiRadioGroup from '@/components/rhf-inputs/rfh-sfi-radio-group'
import { SFI_DOCUMENT_TYPES } from '@/constants/sfi/document-types.const'
import { getAppConfig } from '@/utils/get-app-config'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { IdentityVerificationFormData } from './form-validate/schema'
import PrivyLivenessDialog from './liveness/privy-liveness-dialog'
import PrivyLivenessUpload from './liveness/privy-liveness-upload'
import { usePrivyLiveness } from './liveness/use-privy-liveness'
import { IndonesianOcrTarget, useIndonesianOcr } from './ocr/use-indonesian-ocr'
import VerificationDocumentUpload, { VerificationDocumentData } from './verification-document-upload'

interface IdentityVerificationFormSectionProps {
	onProcessingChange: (isProcessing: boolean) => void
}

type UploadTarget = 'front' | 'selfie' | 'npwp'

function IdentityVerificationFormSection({ onProcessingChange }: IdentityVerificationFormSectionProps) {
	const apiBase = getAppConfig()?.api
	const { control, setValue, watch } = useFormContext<IdentityVerificationFormData>()
	const { currentIndiApp, uploadApplicationDocumentMutation, deleteApplicationDocumentMutation } =
		useCustomerApplication()
	const { attemptId, isAnyOcrLoading, isOcrLoading, runOcr } = useIndonesianOcr()
	const [uploadingTargets, setUploadingTargets] = useState<Partial<Record<UploadTarget, boolean>>>({})
	const verificationDocument = watch('verification_document')
	const selfie = watch('selfie')
	const { closeLiveness, isLivenessProcessing, livenessUrl, startLiveness } = usePrivyLiveness({
		attemptId,
		onSelfieUploaded: (data) => setValue('selfie', data, { shouldValidate: true }),
	})
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
		const getDocumentUrl = (path?: string) => (path ? `${apiBase}/storage/${path}` : '')

		setValue('front', {
			file: null,
			previewUrl: getDocumentUrl(
				verificationDocument === 'ktp' ? existingFront?.path : existingPassportFront?.path
			),
			base64: '',
		})
		setValue('selfie', {
			file: null,
			previewUrl: getDocumentUrl(existingSelfie?.path),
			base64: '',
		})
		setValue('npwp_photo', {
			file: null,
			previewUrl: getDocumentUrl(existingNpwpPhoto?.path),
			base64: '',
		})
	}, [
		apiBase,
		existingFront?.path,
		existingNpwpPhoto?.path,
		existingPassportFront?.path,
		existingSelfie?.path,
		setValue,
		verificationDocument,
	])

	const handleFileSelect = async (type: UploadTarget, data: VerificationDocumentData) => {
		if (!currentIndiApp) return
		setUploadingTargets((current) => ({ ...current, [type]: true }))

		try {
			let documentType: number
			let replacedDocumentTypes: number[]
			let ocrTarget: IndonesianOcrTarget | undefined

			if (type === 'front') {
				const isKtp = verificationDocument === 'ktp'
				documentType = isKtp ? SFI_DOCUMENT_TYPES.KTP_FRONT : SFI_DOCUMENT_TYPES.PASSPORT_FRONT
				replacedDocumentTypes = [SFI_DOCUMENT_TYPES.KTP_FRONT, SFI_DOCUMENT_TYPES.PASSPORT_FRONT]
				ocrTarget = isKtp ? 'ktp' : 'passport'
			} else if (type === 'selfie') {
				documentType = SFI_DOCUMENT_TYPES.PASSPORT_SELFIE
				replacedDocumentTypes = [SFI_DOCUMENT_TYPES.PASSPORT_SELFIE]
			} else {
				documentType = SFI_DOCUMENT_TYPES.NPWP
				replacedDocumentTypes = [SFI_DOCUMENT_TYPES.NPWP]
				ocrTarget = 'npwp'
			}

			await Promise.all(
				existingDocuments
					.filter((document) => replacedDocumentTypes.includes(Number(document.type_id)))
					.map((document) => deleteApplicationDocumentMutation.mutateAsync({ documentId: document.id }))
			)

			if (ocrTarget) void runOcr(ocrTarget, data.file)

			await uploadApplicationDocumentMutation.mutateAsync({
				applicationId: currentIndiApp.id,
				typeProof: documentType.toString(),
				files: [data.file],
			})

			setValue(type === 'npwp' ? 'npwp_photo' : type, data)
		} catch (error: unknown) {
			console.error('Document upload failed:', error)
		} finally {
			setUploadingTargets((current) => {
				const next = { ...current }
				delete next[type]
				return next
			})
		}
	}

	const identityLabel = verificationDocument === 'ktp' ? 'KTP' : 'Passport'
	const frontOcrTarget = verificationDocument === 'ktp' ? 'ktp' : 'passport'
	const isFrontProcessing = Boolean(uploadingTargets.front) || isOcrLoading(frontOcrTarget)
	const isSelfieProcessing = Boolean(uploadingTargets.selfie)
	const isNpwpProcessing = Boolean(uploadingTargets.npwp) || isOcrLoading('npwp')
	const isProcessing = Object.values(uploadingTargets).some(Boolean) || isAnyOcrLoading || isLivenessProcessing

	useEffect(() => {
		onProcessingChange(isProcessing)
	}, [isProcessing, onProcessingChange])

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<p className="text-mui-primary-main text-lg font-semibold">Upload KTP/Passport for verification</p>
				<p className="text-mui-text-secondary text-sm">
					Clear copies of Government issued Identity Document / Passport that contains a photo & has at least
					6 months validity
				</p>
			</div>

			<RfhSfiRadioGroup
				name="verification_document"
				control={control}
				disabled={isProcessing}
				row
				className="gap-8"
				options={[
					{ label: 'Indonesian identity card (KTP)', value: 'ktp' },
					{ label: 'Passport', value: 'passport' },
				]}
			/>

			<div>
				<p className="text-mui-text-primary mb-4 text-base font-semibold">
					Upload {verificationDocument === 'ktp' ? 'Indonesian Identity(KTP)' : 'Passport'}
				</p>

				<div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
					<VerificationDocumentUpload
						name="front"
						control={control}
						label="Front Side"
						onFileSelect={(data) => handleFileSelect('front', data)}
						disabled={isFrontProcessing}
					/>

					{verificationDocument === 'ktp' ? (
						<PrivyLivenessUpload
							previewUrl={selfie.previewUrl}
							disabled={isLivenessProcessing || Boolean(uploadingTargets.front) || isOcrLoading('ktp')}
							onStart={startLiveness}
						/>
					) : (
						<VerificationDocumentUpload
							name="selfie"
							control={control}
							label={`Selfie with your ${identityLabel}`}
							onFileSelect={(data) => handleFileSelect('selfie', data)}
							disabled={isSelfieProcessing}
						/>
					)}
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<p className="text-mui-primary-main text-lg font-semibold">Tax Identification Number(NPWP)</p>
					<p className="text-mui-text-secondary text-sm">Upload a clear photo of your NPWP</p>
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<VerificationDocumentUpload
						name="npwp_photo"
						control={control}
						label="NPWP photo"
						onFileSelect={(data) => handleFileSelect('npwp', data)}
						disabled={isNpwpProcessing}
					/>
				</div>
			</div>

			<PrivyLivenessDialog url={livenessUrl} isProcessing={isLivenessProcessing} onClose={closeLiveness} />
		</div>
	)
}

export default IdentityVerificationFormSection
