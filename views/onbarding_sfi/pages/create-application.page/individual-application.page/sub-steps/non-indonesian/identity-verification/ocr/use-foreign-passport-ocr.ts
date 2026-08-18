'use client'

import { ocrService, OcrDocumentType, OcrJobStatus } from '@/services/common/ocr'
import { toastUtil } from '@/utils/toast'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { useEffect, useRef, useState } from 'react'
import { mapForeignPassportData } from './foreign-passport-mapper'

const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 60000

const waitForNextPoll = (signal: AbortSignal) =>
	new Promise<void>((resolve, reject) => {
		const handleAbort = () => {
			window.clearTimeout(timeoutId)
			reject(signal.reason)
		}
		const timeoutId = window.setTimeout(() => {
			signal.removeEventListener('abort', handleAbort)
			resolve()
		}, POLL_INTERVAL_MS)

		signal.addEventListener('abort', handleAbort, { once: true })
	})

export function useForeignPassportOcr() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const [isLoading, setIsLoading] = useState(false)
	const controllerRef = useRef<AbortController | undefined>(undefined)
	const jobIdRef = useRef<string | undefined>(undefined)
	const applicationRef = useRef(currentIndiApp)

	useEffect(() => {
		applicationRef.current = currentIndiApp
	}, [currentIndiApp])

	useEffect(
		() => () => {
			controllerRef.current?.abort()
			if (jobIdRef.current) void ocrService.deleteJob.delete({ jobId: jobIdRef.current })
		},
		[]
	)

	const runOcr = async (file: File) => {
		controllerRef.current?.abort()
		const controller = new AbortController()
		controllerRef.current = controller
		setIsLoading(true)

		try {
			const health = await ocrService.getLiveHealth.get(controller.signal)
			if (health.status !== 'ok') throw new Error('OCR service is unavailable')

			const job = await ocrService.createJob.post(
				{
					refId: crypto.randomUUID(),
					docId: crypto.randomUUID(),
					docType: OcrDocumentType.Passport,
					issuingCountry: null,
					docLang: null,
				},
				controller.signal
			)
			jobIdRef.current = job.id
			await ocrService.attachJobFile.put({ jobId: job.id, file, signal: controller.signal })

			const startedAt = Date.now()
			let result
			while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
				result = await ocrService.getJob.get({ jobId: job.id, signal: controller.signal })
				if (result.status === OcrJobStatus.Successful || result.status === OcrJobStatus.Failed) break
				await waitForNextPoll(controller.signal)
			}

			if (!result || result.status === OcrJobStatus.Failed) throw new Error('OCR processing failed')
			if (result.status !== OcrJobStatus.Successful) throw new Error('OCR processing timed out')

			const structured = result.results?.[0]?.structured
			if (!structured) throw new Error('Structured OCR data was not found')

			const application = applicationRef.current
			if (!application) return
			const customerParticular = application.content?.customer_particular || {}
			const patch = mapForeignPassportData(structured)
			const updatedApplication = {
				...application,
				content: {
					...application.content,
					customer_particular: {
						...customerParticular,
						identify_verification: {
							...customerParticular.identify_verification,
							...(patch.ktp_or_passport && { ktp_or_passport: patch.ktp_or_passport }),
						},
						personal_information: {
							...customerParticular.personal_information,
							...patch,
						},
					},
				},
			}

			await updateApplicationMutation.mutateAsync({ data: updatedApplication })
			applicationRef.current = updatedApplication
			toastUtil.success('Passport scanned successfully')
		} catch (error: unknown) {
			if (!controller.signal.aborted) {
				toastUtil.error(error instanceof Error ? error.message : 'Passport scan failed')
			}
		} finally {
			if (jobIdRef.current) {
				void ocrService.deleteJob.delete({ jobId: jobIdRef.current })
				jobIdRef.current = undefined
			}
			controllerRef.current = undefined
			setIsLoading(false)
		}
	}

	return { isLoading, runOcr }
}
