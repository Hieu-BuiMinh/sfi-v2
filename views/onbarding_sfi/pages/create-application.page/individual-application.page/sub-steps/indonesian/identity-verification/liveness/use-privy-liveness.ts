'use client'

import { SFI_DOCUMENT_TYPES } from '@/constants/sfi/document-types.const'
import { EkycLanguage, LivenessPayload, customerEkycService } from '@/services/customer/ekyc'
import { toastUtil } from '@/utils/toast'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { useLocale } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { VerificationDocumentData } from '../verification-document-upload'
import {
	addLivenessLanguage,
	createLivenessFile,
	extractLivenessPayload,
	getLivenessFaceImage,
	getLivenessLandingUrl,
	getLivenessResult,
} from './liveness-utils'

interface UsePrivyLivenessOptions {
	attemptId?: string
	onSelfieUploaded: (data: VerificationDocumentData) => void
}

const getCookieLocale = () => {
	const localeCookie = document.cookie
		.split('; ')
		.find((cookie) => cookie.startsWith('NEXT_LOCALE='))
		?.split('=')[1]

	return localeCookie ? decodeURIComponent(localeCookie) : undefined
}

export function usePrivyLiveness({ attemptId, onSelfieUploaded }: UsePrivyLivenessOptions) {
	const locale = useLocale()
	const { currentIndiApp, uploadApplicationDocumentMutation, deleteApplicationDocumentMutation } =
		useCustomerApplication()
	const [livenessUrl, setLivenessUrl] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const isHandlingMessageRef = useRef(false)

	const handleLivenessResult = useCallback(
		async (payload: LivenessPayload) => {
			if (!currentIndiApp || isHandlingMessageRef.current) return

			isHandlingMessageRef.current = true
			setLivenessUrl(null)
			setIsProcessing(true)

			try {
				await customerEkycService.livenessCallback.post({ payload, attempt_id: attemptId || null })

				const faceImage = getLivenessFaceImage(payload)
				if (faceImage) {
					const currentSelfie = currentIndiApp.application_documents.find(
						(document) => document.type_id === SFI_DOCUMENT_TYPES.PASSPORT_SELFIE.toString()
					)

					if (currentSelfie) {
						await deleteApplicationDocumentMutation.mutateAsync({ documentId: currentSelfie.id })
					}

					const file = await createLivenessFile(faceImage)
					await uploadApplicationDocumentMutation.mutateAsync({
						applicationId: currentIndiApp.id,
						typeProof: SFI_DOCUMENT_TYPES.PASSPORT_SELFIE.toString(),
						files: [file],
					})
					onSelfieUploaded({ file, previewUrl: URL.createObjectURL(file), base64: faceImage })
				}

				const result = getLivenessResult(payload)
				if (result.isSuccessful) {
					toastUtil.success('Liveness verification completed successfully')
				} else {
					toastUtil.error(result.message || 'Liveness verification failed')
				}
			} catch (error: unknown) {
				toastUtil.error(error instanceof Error ? error.message : 'Liveness verification failed')
			} finally {
				isHandlingMessageRef.current = false
				setIsProcessing(false)
			}
		},
		[
			attemptId,
			currentIndiApp,
			deleteApplicationDocumentMutation,
			onSelfieUploaded,
			uploadApplicationDocumentMutation,
		]
	)

	useEffect(() => {
		if (!livenessUrl) return

		const allowedOrigin = new URL(livenessUrl).origin
		const handleMessage = (event: MessageEvent<unknown>) => {
			if (event.origin !== allowedOrigin) return

			const payload = extractLivenessPayload(event.data)
			if (payload) void handleLivenessResult(payload)
		}

		window.addEventListener('message', handleMessage)
		return () => window.removeEventListener('message', handleMessage)
	}, [handleLivenessResult, livenessUrl])

	const startLiveness = async () => {
		if (!attemptId) {
			toastUtil.error('Please wait for KTP scan to complete first')
			return
		}

		setIsProcessing(true)

		try {
			const language: EkycLanguage = (getCookieLocale() || locale).startsWith('id') ? 'id' : 'en'
			const response = await customerEkycService.startLiveness.get({ attemptId, language })
			const landingUrl = getLivenessLandingUrl(response)

			if (!landingUrl) throw new Error('Privy liveness URL was not returned')
			setLivenessUrl(addLivenessLanguage(landingUrl, language))
		} catch (error: unknown) {
			toastUtil.error(error instanceof Error ? error.message : 'Unable to start liveness verification')
		} finally {
			setIsProcessing(false)
		}
	}

	return {
		isLivenessProcessing: isProcessing,
		livenessUrl,
		startLiveness,
		closeLiveness: () => setLivenessUrl(null),
	}
}
