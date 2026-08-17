import { clientApi } from '@/lib/api/client'
import { UploadKycDocumentsRequest, UploadKycJsonRequest, CheckFacialStatusRequest } from './kyc-req.dto'
import {
	TKycDocumentsResponse,
	TVerifyKycResponse,
	TKycDocument,
	TCheckFacialStatusResponse,
	TFacialVerifyResponse,
	TUserKycDocumentsResponse,
} from './kyc-res.dto'
import { TApiResponse } from '@/dto/types/api.type'

export const adminKycService = {
	getKycDocumentsByApplicationId: {
		key: ({ applicationId }: { applicationId: string }) =>
			['get_admin_kyc_documents_by_application_id', applicationId] as const,
		get: async ({ applicationId }: { applicationId: string }) => {
			const res = await clientApi.get<TKycDocumentsResponse>(`/api/v1/kyc/documents/${applicationId}`)
			return res.data
		},
	},

	getUserKycDocumentsByEmail: {
		key: ({ email }: { email: string }) => ['get_user_kyc_documents_by_email', email] as const,
		get: async ({ email }: { email: string }) => {
			const res = await clientApi.get<TUserKycDocumentsResponse>(`/api/v1/kyc/users/${email}/documents`)
			return res.data
		},
	},

	uploadKycDocuments: {
		key: () => ['post_admin_upload_kyc_documents'] as const,
		post: async (params: FormData | UploadKycDocumentsRequest | UploadKycJsonRequest) => {
			if (params instanceof FormData) {
				const res = await clientApi.post<TApiResponse<TKycDocument | TKycDocument[]>>(
					'/api/v1/kyc/upload',
					params
				)
				return res.data
			}

			if ('file' in params) {
				const body = new FormData()
				body.append('application_id', params.application_id)
				body.append('type_id', params.type_id)
				body.append('file', params.file)
				const res = await clientApi.post<TApiResponse<TKycDocument[]>>('/api/v1/kyc/upload', body)
				return res.data
			}

			const res = await clientApi.post<TApiResponse<TKycDocument>>('/api/v1/kyc/upload', params)
			return res.data
		},
	},

	verifyKyc: {
		key: () => ['post_admin_verify_kyc'] as const,
		post: async (body: { application_id: string }) => {
			const res = await clientApi.post<TVerifyKycResponse>('/api/v1/kyc/verify', body)
			return res.data
		},
	},

	checkFacialStatus: {
		key: ({ reference }: CheckFacialStatusRequest) => ['get_admin_check_facial_status', reference] as const,
		get: async ({ reference }: CheckFacialStatusRequest) => {
			const res = await clientApi.get<TCheckFacialStatusResponse>(`/api/v1/kyc/facial-status`, {
				params: { reference },
			})
			return res.data
		},
	},

	getFacialVerify: {
		key: () => ['get_admin_facial_verify'] as const,
		get: async () => {
			const res = await clientApi.get<TFacialVerifyResponse>(`/api/v1/kyc/facial-verify`)
			return res.data
		},
	},

	resendKycEmail: {
		key: () => ['post_admin_resend_kyc_email'] as const,
		post: async ({ applicationId, email }: { applicationId: string; email: string }) => {
			const res = await clientApi.post<
				TApiResponse<{
					application_id: string
					email: string
					kyc_link: string
				}>
			>(`/api/v1/sfs/kyc/${applicationId}/resend`, { email })
			return res.data
		},
	},

	approveKyc: {
		key: () => ['post_admin_approve_kyc'] as const,
		post: async ({ applicationId, email }: { applicationId: string; email: string }) => {
			const res = await clientApi.post<
				TApiResponse<{
					message: string
				}>
			>(`/api/v1/sfs/kyc/${applicationId}/hard-pass`, { email })
			return res.data
		},
	},

	getFacialBiometrics: {
		key: () => ['post_admin_facial_verification'] as const,
		post: async ({ reference }: { reference: string }) => {
			const res = await clientApi.post<TVerifyKycResponse>(`/api/v1/kyc/facial-verification`, {
				reference,
			})
			return res.data
		},
	},
}
