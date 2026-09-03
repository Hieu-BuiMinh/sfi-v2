import { TApiResponse } from '@/dto/types/api.type'
import { clientApi } from '@/lib/api/client'
import {
	TDeleteEmailTemplateAttachmentParams,
	TGetEmailTemplateDetailParams,
	TGetEmailTemplatesParams,
	TPreviewEmailTemplateParams,
	TPreviewEmailTemplateRequest,
	TSendTestEmailRequest,
	TUploadEmailTemplateAttachmentParams,
	TUpdateEmailTemplateRequest,
} from './email-templates-req.dto'
import {
	TEmailTemplateAttachmentsResponse,
	TEmailTemplateDetail,
	TEmailTemplateList,
	TPreviewEmailTemplateResponse,
	TSendTestEmailResponse,
	TUpdateEmailTemplateResponse,
} from './email-templates-res.dto'

export const adminEmailTemplatesService = {
	getEmailTemplates: {
		key: (params: TGetEmailTemplatesParams) => ['get_admin_staffs_email_templates', params] as const,
		get: async (params: TGetEmailTemplatesParams) => {
			const res = await clientApi.get<TApiResponse<TEmailTemplateList>>('/api/v1/staffs/email-templates', {
				params,
			})
			return res.data
		},
	},
	getEmailTemplateDetail: {
		key: ({ id }: TGetEmailTemplateDetailParams) => ['get_admin_staffs_email_template_detail', id] as const,
		get: async ({ id }: TGetEmailTemplateDetailParams) => {
			const res = await clientApi.get<TApiResponse<TEmailTemplateDetail>>(
				`/api/v1/staffs/email-templates/${encodeURIComponent(id)}`
			)
			return res.data
		},
	},
	postPreviewEmailTemplate: {
		key: ({ id }: TPreviewEmailTemplateParams) => ['post_admin_staffs_email_template_preview', id] as const,
		post: async ({ id, body }: TPreviewEmailTemplateParams & { body: TPreviewEmailTemplateRequest }) => {
			const res = await clientApi.post<TApiResponse<TPreviewEmailTemplateResponse>>(
				`/api/v1/staffs/email-templates/${encodeURIComponent(id)}/preview`,
				body
			)
			return res.data
		},
	},
	updateEmailTemplate: {
		key: ({ id }: TGetEmailTemplateDetailParams) => ['put_admin_staffs_email_template', id] as const,
		put: async ({ id, body }: TGetEmailTemplateDetailParams & { body: TUpdateEmailTemplateRequest }) => {
			const res = await clientApi.put<TApiResponse<TUpdateEmailTemplateResponse>>(
				`/api/v1/staffs/email-templates/${encodeURIComponent(id)}`,
				body
			)
			return res.data
		},
	},
	postSendTestEmail: {
		key: ({ id }: TGetEmailTemplateDetailParams) => ['post_admin_staffs_email_template_send_test', id] as const,
		post: async ({ id, body }: TGetEmailTemplateDetailParams & { body: TSendTestEmailRequest }) => {
			const res = await clientApi.post<TApiResponse<TSendTestEmailResponse>>(
				`/api/v1/staffs/email-templates/${encodeURIComponent(id)}/send-test`,
				body
			)
			return res.data
		},
	},
	uploadEmailTemplateAttachment: {
		key: ({ id }: TGetEmailTemplateDetailParams) => ['post_admin_staffs_email_template_attachment', id] as const,
		post: async ({ id, file }: TUploadEmailTemplateAttachmentParams) => {
			const formData = new FormData()
			formData.append('file', file)

			const res = await clientApi.post<TApiResponse<TEmailTemplateAttachmentsResponse>>(
				`/api/v1/staffs/email-templates/${encodeURIComponent(id)}/attachments`,
				formData
			)
			return res.data
		},
	},
	deleteEmailTemplateAttachment: {
		key: ({ id, index }: TDeleteEmailTemplateAttachmentParams) =>
			['delete_admin_staffs_email_template_attachment', id, index] as const,
		delete: async ({ id, index }: TDeleteEmailTemplateAttachmentParams) => {
			const res = await clientApi.delete<TApiResponse<TEmailTemplateAttachmentsResponse>>(
				`/api/v1/staffs/email-templates/${encodeURIComponent(id)}/attachments/${index}`
			)
			return res.data
		},
	},
}
