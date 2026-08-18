import { clientApi } from '@/lib/api/client'
import { AttachOcrJobFileRequest, CreateOcrJobRequest, OcrJobRequest } from './ocr-req.dto'
import { CreateOcrJobResponse, DeleteOcrJobResponse, OcrHealthResponse, OcrJobResponse } from './ocr-res.dto'

const getLocalUrl = (path: string) => (typeof window !== 'undefined' ? `${window.location.origin}${path}` : path)

export const ocrService = {
	getLiveHealth: {
		key: () => ['get_ocr_live_health'] as const,
		get: async (signal?: AbortSignal) => {
			const res = await clientApi.get<OcrHealthResponse>(getLocalUrl('/api/ocr/health/live'), { signal })
			return res.data
		},
	},

	getReadyHealth: {
		key: () => ['get_ocr_ready_health'] as const,
		get: async (signal?: AbortSignal) => {
			const res = await clientApi.get<OcrHealthResponse>(getLocalUrl('/api/ocr/health/ready'), { signal })
			return res.data
		},
	},

	createJob: {
		key: () => ['post_ocr_job'] as const,
		post: async (body: CreateOcrJobRequest, signal?: AbortSignal) => {
			const res = await clientApi.post<CreateOcrJobResponse>(getLocalUrl('/api/ocr/v1/jobs'), body, { signal })
			return res.data
		},
	},

	attachJobFile: {
		key: ({ jobId }: OcrJobRequest) => ['put_ocr_job_file', jobId] as const,
		put: async ({ jobId, file, signal }: AttachOcrJobFileRequest) => {
			const formData = new FormData()
			formData.append('file', file)

			const res = await clientApi.put<OcrJobResponse>(getLocalUrl(`/api/ocr/v1/jobs/${jobId}/file`), formData, {
				signal,
			})
			return res.data
		},
	},

	getJob: {
		key: ({ jobId }: OcrJobRequest) => ['get_ocr_job', jobId] as const,
		get: async ({ jobId, signal }: OcrJobRequest) => {
			const res = await clientApi.get<OcrJobResponse>(getLocalUrl(`/api/ocr/v1/jobs/${jobId}`), { signal })
			return res.data
		},
	},

	deleteJob: {
		key: ({ jobId }: OcrJobRequest) => ['delete_ocr_job', jobId] as const,
		delete: async ({ jobId }: OcrJobRequest) => {
			const res = await clientApi.delete<DeleteOcrJobResponse>(getLocalUrl(`/api/ocr/v1/jobs/${jobId}`))
			return res.data
		},
	},
}

export * from './ocr-req.dto'
export * from './ocr-res.dto'
