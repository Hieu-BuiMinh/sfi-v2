/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientApi } from '@/lib/api/client'
import { CreateDepositRequest, DepositBeneficiaryBank } from './deposit.dto'
import { TApiResponse } from '@/dto/types/api.type'

export const customerDepositService = {
	getBeneficiaryBanks: {
		key: () => ['get_customer_deposit_beneficiary_banks'] as const,
		get: async () => {
			const res = await clientApi.get<TApiResponse<DepositBeneficiaryBank[]>>(`/api/v1/finance/payment-methods`)
			return res.data
		},
	},

	createDeposit: {
		key: () => ['post_customer_create_deposit'] as const,
		post: async ({
			tradingAccountId,
			body,
		}: {
			tradingAccountId: string | number
			body: CreateDepositRequest | FormData
		}) => {
			const res = await clientApi.post<TApiResponse<any>>(
				`/api/v2/finance/transactions/deposit/${encodeURIComponent(tradingAccountId)}`,
				body
			)
			return res.data
		},
	},
}
