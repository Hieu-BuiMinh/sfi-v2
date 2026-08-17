import { clientApi } from '@/lib/api/client'
import { TApiListResponse, TApiResponse } from '@/dto/types/api.type'
import { TMT5UserRes } from './mt5-res.dto'
import { TMT5HistoryParams } from './mt5-req.dto'
import { TMT5OrdersResponse } from './orders-res.dto'
import { TMT5DealsResponse } from './deals-res.dto'

export const adminMt5Service = {
	getMT5UserById: {
		key: (login: string) => ['get_admin_mt5_user_by_id', login] as const,
		get: async (login: string) => {
			const res = await clientApi.get<TApiResponse<TMT5UserRes>>(`/api/v1/mt5/users/${login}`)
			return res.data
		},
	},

	getOrders: {
		key: ({ login, params }: { login: string; params: TMT5HistoryParams }) =>
			['get_admin_mt5_orders', login, params] as const,
		get: async ({ login, params }: { login: string; params: TMT5HistoryParams }) => {
			const res = await clientApi.get<TApiListResponse<TMT5OrdersResponse>>(`/api/v1/mt5/users/${login}/orders`, { params })
			return res.data
		},
	},

	getDeals: {
		key: ({ login, params }: { login: string; params: TMT5HistoryParams }) =>
			['get_admin_mt5_deals', login, params] as const,
		get: async ({ login, params }: { login: string; params: TMT5HistoryParams }) => {
			const res = await clientApi.get<TApiListResponse<TMT5DealsResponse>>(`/api/v1/mt5/users/${login}/deals`, { params })
			return res.data
		},
	},
}
