import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { UserPaymentMethodItem } from './user-payment-methods-res.dto'

export const customerUserPaymentMethodsService = {
	getUserPaymentMethods: {
		key: () => ['get_customer_user_payment_methods'] as const,
		get: async () => {
			const res = await clientApi.get<TApiResponse<UserPaymentMethodItem[]>>('/api/v1/finance/user-payment-methods')
			return res.data
		},
	},
}
