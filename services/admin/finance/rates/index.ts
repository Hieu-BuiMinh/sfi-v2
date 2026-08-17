import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { TRateCreateParams, TRateListParams, TRateStatusUpdateParams, TRateUpdateParams } from './rates-req.dto'
import { TRateItem, TRateListResponse } from './rates-res.dto'

export const adminFinanceRatesService = {
	getRatesList: {
		key: (params: TRateListParams) => ['get_admin_finance_rates_list', params] as const,
		get: async (params: TRateListParams) => {
			const { type, view, page = 1, per_page = 10 } = params
			const endpoint = view === 'current' ? 'current' : 'historical'

			const res = await clientApi.get<TApiResponse<TRateListResponse>>(`/api/v1/finance/exchange-rate/list/${endpoint}`, {
				params: {
					rate_type: type,
					page,
					per_page,
				},
			})
			return res.data
		},
	},

	createRate: {
		post: async (body: TRateCreateParams) => {
			const res = await clientApi.post<TApiResponse<TRateItem>>(`/api/v1/finance/exchange-rate`, body)
			return res.data
		},
	},

	updateRate: {
		put: async (body: TRateUpdateParams) => {
			const { id, ...data } = body
			const res = await clientApi.put<TApiResponse<TRateItem>>(
				`/api/v1/finance/exchange-rate/${id}`,
				data as TRateCreateParams
			)
			return res.data
		},
	},

	updateRateStatus: {
		patch: async (params: TRateStatusUpdateParams) => {
			const { id, status } = params
			const res = await clientApi.patch<TApiResponse<TRateItem>>(
				`/api/v1/finance/exchange-rate/update-status/${id}`,
				{ status: status as number }
			)
			return res.data
		},
	},
}
