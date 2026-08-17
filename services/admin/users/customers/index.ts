import { TApiListResponse, TApiResponse } from '@/dto/types/api.type'
import { TCustomerApplicationListItem, TCustomerProfileResponse } from './customer-res.dto'
import { GetCustomersRequest } from '@/services/admin/users/customers/customer-req.dto'
import { clientApi } from '@/lib/api/client'

export const adminCustomerService = {
	getCustomers: {
		key: (params: GetCustomersRequest) => ['get_admin_customers', params] as const,
		get: async (params: GetCustomersRequest) => {
			const { page = 1, perPage = 10, ...rest } = params
			const res = await clientApi.get<TApiListResponse<TCustomerApplicationListItem>>('/api/v1/users/customers', {
				params: {
					...rest,
					page,
					perPage,
				},
			})
			return res.data
		},
	},

	getCustomerDetail: {
		key: ({ auth0, applicationId }: { auth0: string; applicationId: string }) =>
			['get_admin_customer_detail', auth0, applicationId] as const,
		get: async ({ auth0, applicationId }: { auth0: string; applicationId: string }) => {
			const res = await clientApi.get<TApiResponse<TCustomerProfileResponse[]>>(
				`/api/v1/users/customers/${auth0}/profile/application/${applicationId}`
			)
			return res.data
		},
	},
}
