'use client'

import { SFI_DOCUMENT_TYPES } from '@/constants/sfi/document-types.const'
import { getAppConfig } from '@/utils/get-app-config'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { IdentityVerificationFormData } from './form-validate/schema'
import { useForeignPassportOcr } from './ocr/use-foreign-passport-ocr'
import VerificationDocumentUpload, { VerificationDocumentData } from './verification-document-upload'

interface Props {
	onProcessingChange: (isProcessing: boolean) => void
}

type UploadTarget = 'front' | 'selfie'

function NonIndoIdentityVerificationFormSection({ onProcessingChange }: Props) {
	const apiBase = getAppConfig()?.api
	const { control, setValue } = useFormContext<IdentityVerificationFormData>()
	const { currentIndiApp, uploadApplicationDocumentMutation, deleteApplicationDocumentMutation } =
		useCustomerApplication()
	const { isLoading: isOcrLoading, runOcr } = useForeignPassportOcr()
	const [uploadingTargets, setUploadingTargets] = useState<Partial<Record<UploadTarget, boolean>>>({})
	const existingDocuments = currentIndiApp?.application_documents || []
	const existingPassport = existingDocuments.find(
		(document) => Number(document.type_id) === SFI_DOCUMENT_TYPES.PASSPORT_FRONT
	)
	const existingSelfie = existingDocuments.find(
		(document) => Number(document.type_id) === SFI_DOCUMENT_TYPES.PASSPORT_SELFIE
	)

	useEffect(() => {
		const getDocumentUrl = (path?: string) => (path ? `${apiBase}/storage/${path}` : '')
		setValue('front', { file: null, previewUrl: getDocumentUrl(existingPassport?.path), base64: '' })
		setValue('selfie', { file: null, previewUrl: getDocumentUrl(existingSelfie?.path), base64: '' })
	}, [apiBase, existingPassport?.path, existingSelfie?.path, setValue])

	const handleFileSelect = async (target: UploadTarget, data: VerificationDocumentData) => {
		if (!currentIndiApp) return
		setUploadingTargets((current) => ({ ...current, [target]: true }))

		try {
			const documentType =
				target === 'front' ? SFI_DOCUMENT_TYPES.PASSPORT_FRONT : SFI_DOCUMENT_TYPES.PASSPORT_SELFIE
			await Promise.all(
				existingDocuments
					.filter((document) => Number(document.type_id) === documentType)
					.map((document) => deleteApplicationDocumentMutation.mutateAsync({ documentId: document.id }))
			)

			if (target === 'front') void runOcr(data.file)
			await uploadApplicationDocumentMutation.mutateAsync({
				applicationId: currentIndiApp.id,
				typeProof: documentType.toString(),
				files: [data.file],
			})
			setValue(target, data, { shouldValidate: true })
		} catch (error: unknown) {
			console.error('Document upload failed:', error)
		} finally {
			setUploadingTargets((current) => {
				const next = { ...current }
				delete next[target]
				return next
			})
		}
	}

	const isPassportProcessing = Boolean(uploadingTargets.front) || isOcrLoading
	const isSelfieProcessing = Boolean(uploadingTargets.selfie)
	const isProcessing = Object.values(uploadingTargets).some(Boolean) || isOcrLoading

	useEffect(() => {
		onProcessingChange(isProcessing)
	}, [isProcessing, onProcessingChange])

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<p className="text-mui-primary-main text-lg font-semibold">Upload Passport for verification</p>
				<p className="text-mui-text-secondary text-sm">
					Upload a clear passport image for OCR and a selfie with your passport for identity verification.
				</p>
			</div>

			<div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
				<VerificationDocumentUpload
					name="front"
					control={control}
					label="Passport"
					onFileSelect={(data) => handleFileSelect('front', data)}
					disabled={isPassportProcessing}
				/>
				<VerificationDocumentUpload
					name="selfie"
					control={control}
					label="Selfie with your passport"
					onFileSelect={(data) => handleFileSelect('selfie', data)}
					disabled={isSelfieProcessing}
				/>
			</div>
		</div>
	)
}

export default NonIndoIdentityVerificationFormSection
