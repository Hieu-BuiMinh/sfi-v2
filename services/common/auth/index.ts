import { clientApi } from '@/lib/api/client'
import { CheckVerificationResponse, ResendVerificationResponse } from './auth-res.dto'

const getLocalUrl = (path: string) => (typeof window !== 'undefined' ? `${window.location.origin}${path}` : path)

export const authService = {
	checkVerification: {
		key: () => ['check_verification'] as const,
		get: async () => {
			const res = await clientApi.get<CheckVerificationResponse>(getLocalUrl('/api/auth/check-verification'))
			return res.data
		},
	},

	resendVerification: {
		key: () => ['resend_verification'] as const,
		post: async () => {
			const res = await clientApi.post<ResendVerificationResponse>(getLocalUrl('/api/auth/resend-verification'))
			return res.data
		},
	},
}

export * from './auth-req.dto'
export * from './auth-res.dto'
