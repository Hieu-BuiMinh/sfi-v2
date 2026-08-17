import { clientApi } from '@/lib/api/client'
import {
	AccountAssetsDistributions,
	AccountItemByType,
	CustomerAccount,
	CustomerAccountDailyEquity,
	CustomerMT5Accountdetail,
} from './account-res.dto'
import { TApiResponse } from '@/dto/types/api.type'

export const customerAccountService = {
	getAccountList: {
		key: (email?: string) => ['get_customer_account_list', email] as const,
		get: async ({ email }: { email?: string }) => {
			const res = await clientApi.get<TApiResponse<CustomerAccount[]>>(`/api/v2/trading-accounts/list`, {
				params: { email },
			})
			return res.data
		},
	},

	getMt5AccountById: {
		key: ({ id }: { id: string }) => ['get_customer_mt5_account_by_id', id] as const,
		get: async ({ id }: { id: string }) => {
			const res = await clientApi.get<TApiResponse<CustomerMT5Accountdetail>>(`/api/v2/accounts/${id}`)
			return res.data
		},
	},

	getAccountDailyEquity: {
		key: ({ id }: { id: string }) => ['get_customer_account_daily_equity', id] as const,
		get: async ({ id }: { id: string }) => {
			const res = await clientApi.get<TApiResponse<CustomerAccountDailyEquity>>(`/api/v2/accounts/${id}/daily-equity`)
			return res.data
		},
	},

	getAccountAssetsDistributions: {
		key: ({ id }: { id: string }) => ['get_customer_account_assets_distributions', id] as const,
		get: async ({ id }: { id: string }) => {
			const res = await clientApi.get<TApiResponse<AccountAssetsDistributions[]>>(
				`/api/v2/accounts/${id}/symbols/assets-distribution`
			)
			return res.data
		},
	},

	getAccountListByType: {
		key: ({ type }: { type: 'LIVE' | 'TRIAL' }) => ['get_customer_account_list_by_type', type] as const,
		get: async ({ type }: { type: 'LIVE' | 'TRIAL' }) => {
			const res = await clientApi.get<TApiResponse<AccountItemByType[]>>(`/api/v2/my-accounts/type/${type}`)
			return res.data
		},
	},
}
