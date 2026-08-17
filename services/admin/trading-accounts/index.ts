import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { TBindTradingAccountReq, TUpdateTradingAccountReq, TAtpIdUpdateReq } from './trading-account-req.dto'
import { TBindTradingAccountRes, TTradingAccountItem, TAtpIdUpdateRes } from './trading-account-res.dto'

export const adminTradingAccountService = {
	bindTradingAccount: {
		key: () => ['post_admin_bind_trading_account'] as const,
		post: async (payload: TBindTradingAccountReq) => {
			const res = await clientApi.post<TApiResponse<TBindTradingAccountRes>>(`/api/v1/trading-accounts`, payload)
			return res.data
		},
	},

	updateTradingAccount: {
		key: ({ id }: { id: string }) => ['put_admin_update_trading_account', id] as const,
		put: async ({ id, payload }: { id: string; payload: TUpdateTradingAccountReq }) => {
			const res = await clientApi.put<TApiResponse<TBindTradingAccountRes>>(`/api/v1/trading-accounts/${id}`, payload)
			return res.data
		},
	},

	getTradingAccountList: {
		key: ({ email }: { email?: string }) => ['get_admin_trading_account_list', email] as const,
		get: async ({ email }: { email?: string }) => {
			const res = await clientApi.get<TApiResponse<TTradingAccountItem[]>>(`/api/v1/trading-accounts/list`, {
				params: { email },
			})
			return res.data
		},
	},
	updateAtpId: {
		key: () => ['post_admin_update_atp_id'] as const,
		post: async (payload: TAtpIdUpdateReq) => {
			const res = await clientApi.post<TApiResponse<TAtpIdUpdateRes>>(`/api/v1/trading-accounts/atp/update`, payload)
			return res.data
		},
	},
}
