import { clientApi } from '@/lib/api/client'
import { GetOrderHistoryParams } from './orders-req.dto'
import { OrderHistoryResponse } from './orders-res.dto'
import { TApiResponse } from '@/dto/types/api.type'
import dayjs from 'dayjs'

export const adminOrdersService = {
	getOrderHistory: {
		key: (params: GetOrderHistoryParams) => ['get_admin_order_history', params] as const,
		get: async (params: GetOrderHistoryParams) => {
			const { idLogin, search = null, from, to, page = '1', perPage = '10', entity = '' } = params

			const exchange = entity === 'SFVN' ? 'MXV' : 'ACM'
			const pageNum = parseInt(String(page))

			const fromUnix = from ? dayjs(from).startOf('day').unix() : null
			const toUnix = to ? dayjs(to).endOf('day').unix() : null

			const res = await clientApi.get<TApiResponse<OrderHistoryResponse>>(`/api/v1/orders/history`, {
				headers: { LoginId: idLogin },
				params: {
					exchange,
					symbolTypes: 'spot,future,option',
					page: pageNum,
					pageSize: perPage,
					from: fromUnix,
					to: toUnix,
					prefixSymbol: search,
				},
			})
			return res.data
		},
	},
}
