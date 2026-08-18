'use client'

import { ocrService, OcrDocumentType, OcrJobStatus } from '@/services/common/ocr'
import { customerEkycService } from '@/services/customer/ekyc'
import { toastUtil } from '@/utils/toast'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { useEffect, useRef, useState } from 'react'
import { findKtpData, mapKtpData, mapNpwpData, mapPassportData, PersonalInformationOcrPatch } from './ocr-mappers'

export type IndonesianOcrTarget = 'ktp' | 'passport' | 'npwp'

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

export function useIndonesianOcr() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const [loadingTargets, setLoadingTargets] = useState<Partial<Record<IndonesianOcrTarget, boolean>>>({})
	const [scannedAttempt, setScannedAttempt] = useState<{ value?: string } | null>(null)
	const controllersRef = useRef<Partial<Record<IndonesianOcrTarget, AbortController>>>({})
	const jobIdsRef = useRef<Partial<Record<IndonesianOcrTarget, string>>>({})
	const applicationRef = useRef(currentIndiApp)
	const persistQueueRef = useRef<Promise<void>>(Promise.resolve())

	useEffect(() => {
		applicationRef.current = currentIndiApp
	}, [currentIndiApp])

	useEffect(() => {
		const controllers = controllersRef.current
		const jobIds = jobIdsRef.current

		return () => {
			Object.values(controllers).forEach((controller) => controller.abort())
			Object.values(jobIds).forEach((jobId) => void ocrService.deleteJob.delete({ jobId }))
		}
	}, [])

	const persistOcrData = (patch: PersonalInformationOcrPatch, attemptId?: string) => {
		const persist = async () => {
			const application = applicationRef.current
			if (!application) return

			const customerParticular = application.content?.customer_particular || {}
			const updatedApplication = {
				...application,
				content: {
					...application.content,
					customer_particular: {
						...customerParticular,
						identify_verification: {
							...customerParticular.identify_verification,
							...(patch.ktp_or_passport && { ktp_or_passport: patch.ktp_or_passport }),
							...(patch.npwp_number && { npwp_number: patch.npwp_number }),
							...(attemptId && { privy_attempt_id: attemptId }),
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
		}

		const queuedPersist = persistQueueRef.current.then(persist, persist)
		persistQueueRef.current = queuedPersist.then(
			() => undefined,
			() => undefined
		)
		return queuedPersist
	}

	const pollJob = async (target: IndonesianOcrTarget, jobId: string, signal: AbortSignal) => {
		const startedAt = Date.now()

		while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
			const job = await ocrService.getJob.get({ jobId, signal })
			if (job.status === OcrJobStatus.Successful || job.status === OcrJobStatus.Failed) return job
			await waitForNextPoll(signal)
		}

		await ocrService.deleteJob.delete({ jobId })
		delete jobIdsRef.current[target]
		throw new Error('OCR processing timed out')
	}

	const runJobOcr = async (target: 'passport' | 'npwp', file: File, signal: AbortSignal) => {
		const health = await ocrService.getLiveHealth.get(signal)
		if (health.status !== 'ok') throw new Error('OCR service is unavailable')

		const job = await ocrService.createJob.post(
			{
				refId: crypto.randomUUID(),
				docId: crypto.randomUUID(),
				docType: target === 'passport' ? OcrDocumentType.Passport : OcrDocumentType.Npwp,
				issuingCountry: 'ID',
				docLang: 'ID',
			},
			signal
		)

		jobIdsRef.current[target] = job.id
		await ocrService.attachJobFile.put({ jobId: job.id, file, signal })

		const result = await pollJob(target, job.id, signal)
		delete jobIdsRef.current[target]

		if (result.status === OcrJobStatus.Failed) throw new Error('OCR processing failed')
		return result.results?.[0]?.structured
	}

	const runOcr = async (target: IndonesianOcrTarget, file: File) => {
		controllersRef.current[target]?.abort()
		const controller = new AbortController()
		controllersRef.current[target] = controller
		setLoadingTargets((current) => ({ ...current, [target]: true }))

		try {
			if (target === 'ktp') {
				setScannedAttempt({ value: undefined })
				const response = await customerEkycService.ocr.post({ file, signal: controller.signal })
				const ktpData = findKtpData(response.data)
				if (!ktpData) throw new Error('KTP data was not found in the OCR response')

				await persistOcrData(mapKtpData(ktpData), response.attempt_id)
				setScannedAttempt({ value: response.attempt_id })
			} else {
				const structured = await runJobOcr(target, file, controller.signal)
				if (!structured) throw new Error('Structured OCR data was not found')

				await persistOcrData(target === 'passport' ? mapPassportData(structured) : mapNpwpData(structured))
			}

			toastUtil.success('Document scanned successfully')
		} catch (error: unknown) {
			const jobId = jobIdsRef.current[target]
			if (jobId) {
				void ocrService.deleteJob.delete({ jobId })
				delete jobIdsRef.current[target]
			}

			if (!controller.signal.aborted) {
				toastUtil.error(error instanceof Error ? error.message : 'Document scan failed')
			}
		} finally {
			delete controllersRef.current[target]
			setLoadingTargets((current) => {
				const next = { ...current }
				delete next[target]
				return next
			})
		}
	}

	return {
		attemptId:
			scannedAttempt === null
				? currentIndiApp?.content?.customer_particular?.identify_verification?.privy_attempt_id
				: scannedAttempt.value,
		isAnyOcrLoading: Object.values(loadingTargets).some(Boolean),
		isOcrLoading: (target: IndonesianOcrTarget) => Boolean(loadingTargets[target]),
		runOcr,
	}
}
