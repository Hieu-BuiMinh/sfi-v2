import { clientApi } from '@/lib/api/client'
import { GetTermOfUsePdfParams } from './term-of-use-req.dto'
import { TermOfUsePdfResponse } from './term-of-use-res.dto'

export const customerSfiService = {
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
