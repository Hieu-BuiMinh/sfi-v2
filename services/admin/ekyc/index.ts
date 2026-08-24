import { clientApi } from '@/lib/api/client'
import {
	TPrivyCheckStatusResponse,
	TPrivyEkycStatusResponse,
	TPrivyOverrideStatusResponse,
	TPrivyResendResponse,
} from './ekyc-res.dto'

export const adminEkycService = {
	getApplicationStatus: {
		key: ({ applicationId }: { applicationId: string }) =>
			['get_admin_ekyc_application_status', applicationId] as const,
		get: async ({ applicationId }: { applicationId: string }) => {
			const res = await clientApi.get<TPrivyEkycStatusResponse>(
				`/api/v1/ekyc/application/${applicationId}/status`
			)
			return res.data
		},
	},
	checkApplicationStatus: {
		key: () => ['post_admin_ekyc_application_check_status'] as const,
		post: async ({ applicationId }: { applicationId: string }) => {
			const res = await clientApi.post<TPrivyCheckStatusResponse>(
				`/api/v1/ekyc/application/${applicationId}/check-status`,
				{}
			)
			return res.data
		},
	},
	resendApplicationLink: {
		key: () => ['post_admin_ekyc_application_resend'] as const,
		post: async ({ applicationId, lang }: { applicationId: string; lang: string }) => {
			const res = await clientApi.post<TPrivyResendResponse>(`/api/v1/ekyc/application/${applicationId}/resend`, {
				lang,
			})
			return res.data
		},
	},
	overrideApplicationStatus: {
		key: () => ['post_admin_ekyc_application_override_status'] as const,
		post: async ({
			applicationId,
			status,
			reason,
		}: {
			applicationId: string
			status: 'verified' | 'rejected'
			reason: string
		}) => {
			const res = await clientApi.post<TPrivyOverrideStatusResponse>(
				`/api/v1/ekyc/application/${applicationId}/override-status`,
				{ status, reason }
			)
			return res.data
		},
	},
}

export * from './ekyc-res.dto'
