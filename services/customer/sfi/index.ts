import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { ResetTrialBalanceResponse } from './reset-balance-res.dto'
import {
	GetTermOfUsePdfParams,
	TCancelLegalDocumentChunkedUploadRequest,
	TCompleteLegalDocumentChunkedUploadRequest,
	TCreateLegalDocumentTemplateRequest,
	TGetLegalDocumentChunkedUploadStatusParams,
	TGetLegalDocumentTemplateDetailParams,
	TInitLegalDocumentChunkedUploadRequest,
	TUpdateLegalDocumentTemplateRequest,
	TUploadLegalDocumentChunkRequest,
} from './term-of-use-req.dto'
import {
	TermOfUsePdfResponse,
	TCompleteLegalDocumentChunkedUploadResponse,
	TInitLegalDocumentChunkedUploadResponse,
	TLegalDocumentChunkedUploadStatusResponse,
	TLegalDocumentTemplate,
	TUploadLegalDocumentChunkResponse,
} from './term-of-use-res.dto'

export const customerSfiService = {
	resetTrialBalance: {
		key: () => ['post_customer_sfi_reset_trial_balance'] as const,
		post: async () => {
			const response = await clientApi.post<TApiResponse<ResetTrialBalanceResponse>>(
				'/api/v2/sfi/account/reset-balance'
			)

			return response.data
		},
	},

	getTermOfUsePdf: {
		key: ({ userId, pdfType, lang = 'en' }: GetTermOfUsePdfParams) =>
			['get_customer_sfi_term_of_use_pdf', userId, pdfType, lang] as const,
		get: async ({ userId, pdfType, lang = 'en' }: GetTermOfUsePdfParams) => {
			const response = await clientApi.get<TermOfUsePdfResponse>(
				`/api/v2/sfi/term-of-use/${encodeURIComponent(userId)}/pdf`,
				{
					params: { pdf_type: pdfType, lang },
					headers: { entity: 'SFI' },
					responseType: 'blob',
				}
			)

			return response.data
		},
	},

	getTermOfUseTemplateCollection: {
		key: () => ['get_customer_sfi_term_of_use_template_collection'] as const,
		get: async () => {
			const response = await clientApi.get<TApiResponse<TLegalDocumentTemplate[]>>(
				'/api/v2/sfi/term-of-use/template-collection'
			)

			return response.data
		},
	},

	getTermOfUseTemplateDetail: {
		key: ({ name }: TGetLegalDocumentTemplateDetailParams) =>
			['get_customer_sfi_term_of_use_template_detail', name] as const,
		get: async ({ name }: TGetLegalDocumentTemplateDetailParams) => {
			const response = await clientApi.get<TApiResponse<TLegalDocumentTemplate>>(
				`/api/v2/sfi/term-of-use/template-collection/${encodeURIComponent(name)}`
			)

			return response.data
		},
	},

	initTermOfUseTemplateChunkedUpload: {
		key: () => ['post_customer_sfi_term_of_use_template_chunked_init'] as const,
		post: async (data: TInitLegalDocumentChunkedUploadRequest) => {
			const response = await clientApi.post<TApiResponse<TInitLegalDocumentChunkedUploadResponse>>(
				'/api/v2/sfi/term-of-use/template-collection/chunked/init',
				data
			)

			return response.data
		},
	},

	getTermOfUseTemplateChunkedUploadStatus: {
		key: ({ uploadId }: TGetLegalDocumentChunkedUploadStatusParams) =>
			['get_customer_sfi_term_of_use_template_chunked_status', uploadId] as const,
		get: async ({ uploadId }: TGetLegalDocumentChunkedUploadStatusParams) => {
			const response = await clientApi.get<TApiResponse<TLegalDocumentChunkedUploadStatusResponse>>(
				`/api/v2/sfi/term-of-use/template-collection/chunked/status/${encodeURIComponent(uploadId)}`
			)

			return response.data
		},
	},

	uploadTermOfUseTemplateChunk: {
		key: () => ['post_customer_sfi_term_of_use_template_chunk'] as const,
		post: async ({ uploadId, chunkIndex, totalChunks, chunk }: TUploadLegalDocumentChunkRequest) => {
			const response = await clientApi.post<TApiResponse<TUploadLegalDocumentChunkResponse>>(
				'/api/v2/sfi/term-of-use/template-collection/chunked/chunk',
				chunk,
				{
					headers: {
						'Content-Type': 'application/octet-stream',
						'upload-id': uploadId,
						'chunk-index': chunkIndex,
						'total-chunks': totalChunks,
					},
				}
			)

			return response.data
		},
	},

	completeTermOfUseTemplateChunkedUpload: {
		key: () => ['post_customer_sfi_term_of_use_template_chunked_complete'] as const,
		post: async ({ uploadId }: TCompleteLegalDocumentChunkedUploadRequest) => {
			const response = await clientApi.post<TApiResponse<TCompleteLegalDocumentChunkedUploadResponse>>(
				'/api/v2/sfi/term-of-use/template-collection/chunked/complete',
				{ uploadId }
			)

			return response.data
		},
	},

	createTermOfUseTemplate: {
		key: () => ['post_customer_sfi_term_of_use_template'] as const,
		post: async (data: TCreateLegalDocumentTemplateRequest) => {
			const response = await clientApi.post<TApiResponse<unknown>>(
				'/api/v2/sfi/term-of-use/template-collection',
				data
			)

			return response.data
		},
	},

	cancelTermOfUseTemplateChunkedUpload: {
		key: () => ['delete_customer_sfi_term_of_use_template_chunked_upload'] as const,
		delete: async ({ uploadId }: TCancelLegalDocumentChunkedUploadRequest) => {
			const response = await clientApi.delete<TApiResponse<unknown>>(
				`/api/v2/sfi/term-of-use/template-collection/chunked/cancel/${encodeURIComponent(uploadId)}`
			)

			return response.data
		},
	},

	updateTermOfUseTemplate: {
		key: () => ['post_customer_sfi_term_of_use_template_update'] as const,
		post: async (data: TUpdateLegalDocumentTemplateRequest) => {
			const response = await clientApi.post<TApiResponse<unknown>>(
				'/api/v2/sfi/term-of-use/template-collection/update',
				data
			)

			return response.data
		},
	},
}
