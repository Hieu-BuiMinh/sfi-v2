import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { ResetTrialBalanceResponse } from './reset-balance-res.dto'
import { GetTermOfUsePdfParams } from './term-of-use-req.dto'
import { TermOfUsePdfResponse } from './term-of-use-res.dto'

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
}
