import { clientApi } from '@/lib/api/client'
import { LivenessCallbackRequest, PrivyOcrRequest, StartLivenessRequest } from './ekyc-req.dto'
import {
	LivenessCallbackResponse,
	LivenessStartResponse,
	PrivyOcrBalanceResponse,
	PrivyOcrResponse,
} from './ekyc-res.dto'

export const customerEkycService = {
	ocr: {
		key: () => ['post_customer_ekyc_ocr'] as const,
		post: async ({ file, attemptId, reverifyToken, signal }: PrivyOcrRequest) => {
			const formData = new FormData()
			formData.append('ktp', file)

			if (attemptId) formData.append('attempt_id', attemptId)
			if (reverifyToken) formData.append('reverify_token', reverifyToken)

			const res = await clientApi.post<PrivyOcrResponse>('/api/v1/ekyc/ocr', formData, { signal })
			return res.data
		},
	},

	getOcrBalance: {
		key: () => ['get_customer_ekyc_ocr_balance'] as const,
		get: async () => {
			const res = await clientApi.get<PrivyOcrBalanceResponse>('/api/v1/ekyc/ocr/balance')
			return res.data
		},
	},

	startLiveness: {
		key: ({ attemptId, language }: StartLivenessRequest) =>
			['get_customer_ekyc_liveness_start', attemptId, language] as const,
		get: async ({ attemptId, language }: StartLivenessRequest) => {
			const res = await clientApi.get<LivenessStartResponse>('/api/v1/ekyc/liveness/start', {
				params: { attempt_id: attemptId, lang: language },
			})
			return res.data
		},
	},

	livenessCallback: {
		key: () => ['post_customer_ekyc_liveness_callback'] as const,
		post: async (body: LivenessCallbackRequest) => {
			const res = await clientApi.post<LivenessCallbackResponse>('/api/v1/ekyc/liveness/callback', body)
			return res.data
		},
	},
}

export * from './ekyc-req.dto'
export * from './ekyc-res.dto'
