import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { PaymentMethodItem, PaymentMethodReq } from './payment-methods-res.dto'

export const customerPaymentMethodsService = {
	getPaymentMethods: {
		key: () => ['get_customer_payment_methods'] as const,
		get: async () => {
			const res = await clientApi.get<TApiResponse<PaymentMethodItem[]>>('/api/v1/finance/payment-methods')
			return res.data
		},
	},

	getPaymentMethodById: {
		key: (id: string) => ['get_customer_payment_method_by_id', id] as const,
		get: async (id: string) => {
			const res = await clientApi.get<TApiResponse<PaymentMethodItem>>(`/api/v1/finance/payment-methods/${id}`)
			return res.data
		},
	},

	createPaymentMethod: {
		post: async (data: PaymentMethodReq) => {
			const res = await clientApi.post<TApiResponse<PaymentMethodItem>>('/api/v1/finance/payment-methods', data)
			return res.data
		},
	},

	updatePaymentMethod: {
		put: async ({ id, data }: { id: string; data: PaymentMethodReq }) => {
			const res = await clientApi.put<TApiResponse<PaymentMethodItem>>(`/api/v1/finance/payment-methods/${id}`, data)
			return res.data
		},
	},

	deletePaymentMethod: {
		delete: async (id: string) => {
			const res = await clientApi.delete<TApiResponse<null>>(`/api/v1/finance/payment-methods/${id}`)
			return res.data
		},
	},
}
