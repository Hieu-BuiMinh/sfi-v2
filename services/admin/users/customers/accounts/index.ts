import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { TAccountsByTypeResponse } from './account-res.dto'

export const adminCustomerAccountService = {
	getAccountsByType: {
		key: (email: string) => ['get_admin_customer_accounts_by_type', email] as const,
		get: async (email: string) => {
			const res = await clientApi.get<TApiResponse<TAccountsByTypeResponse>>(
				`/api/v1/users/customers/${email}/accounts/type`
			)
			return res.data
		},
	},
}
