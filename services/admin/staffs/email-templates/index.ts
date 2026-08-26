import { TApiResponse } from '@/dto/types/api.type'
import { clientApi } from '@/lib/api/client'
import { TGetEmailTemplateDetailParams, TGetEmailTemplatesParams } from './email-templates-req.dto'
import { TEmailTemplateDetail, TEmailTemplateList } from './email-templates-res.dto'

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
}
