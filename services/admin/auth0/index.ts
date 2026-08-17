/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientApi } from '@/lib/api/client'
import { TAuth0GetLogsParams } from './auth0-req.dto'
import { TAuth0GetLogsResponse } from './auth0-res.dto'
import { TApiResponse } from '@/dto/types/api.type'

export const adminAuth0Service = {
	getVerifyEmailStatus: {
		key: () => ['get_admin_verify_email_status'] as const,
		get: async () => {
			const res = await clientApi.get<TApiResponse<boolean>>(`/api/v1/auth0/is-verified`)
			return res.data
		},
	},

	resendVerifyEmail: {
		key: () => ['post_admin_resend_verify_email'] as const,
		post: async () => {
			const res = await clientApi.post<any>(`/api/v1/auth0/resend-verify-email`, [])
			return res.data
		},
	},

	getLogs: {
		key: ({ id, params }: { id: string; params: TAuth0GetLogsParams }) =>
			['get_admin_auth0_logs', id, params] as const,
		get: async ({ id, params }: { id: string; params: TAuth0GetLogsParams }) => {
			const adjustedPage = params.page > 0 ? params.page - 1 : 0
			const res = await clientApi.get<TApiResponse<TAuth0GetLogsResponse>>(
				`/api/v1/auth0/get-logs/${id}?page=${adjustedPage}&per_page=${params.per_page}`
			)
			return res.data
		},
	},
}
