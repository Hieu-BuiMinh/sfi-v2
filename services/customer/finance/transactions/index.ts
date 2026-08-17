/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientApi } from '@/lib/api/client'
import { CreateWithdrawalRequest, GetTransactionsParams, GetVerifiedAmountParams } from './transactions-req.dto'
import { TransactionItem, VerifiedAmountResponse } from './transactions-res.dto'
import { TApiListResponse, TApiResponse } from '@/dto/types/api.type'

export const customerFinanceTransactionsService = {
	getDepositList: {
		key: (params: GetTransactionsParams) => ['get_customer_finance_deposit_list', params] as const,
		get: async (params: GetTransactionsParams) => {
			const { id, ...rest } = params
			const res = await clientApi.get<TApiListResponse<TransactionItem>>(`/api/v2/finance/transactions/deposit`, {
				params: { ...rest, trading_account_id: id },
			})
			return res.data
		},
	},

	getWithdrawalList: {
		key: (params: GetTransactionsParams) => ['get_customer_finance_withdrawal_list', params] as const,
		get: async (params: GetTransactionsParams) => {
			const { id, ...rest } = params
			const res = await clientApi.get<TApiListResponse<TransactionItem>>(`/api/v2/finance/transactions/withdraw`, {
				params: { ...rest, trading_account_id: id },
			})
			return res.data
		},
	},

	getVerifiedAmount: {
		key: (params: GetVerifiedAmountParams) => ['get_customer_finance_verified_amount', params] as const,
		get: async (params: GetVerifiedAmountParams) => {
			const res = await clientApi.get<TApiResponse<VerifiedAmountResponse>>(
				'/api/v1/finance/transactions/get-verified-amount',
				{ params }
			)
			return res.data
		},
	},

	createWithdrawal: {
		key: () => ['post_customer_create_withdrawal'] as const,
		post: async ({
			tradingAccountId,
			body,
		}: {
			tradingAccountId: string | number
			body: CreateWithdrawalRequest
		}) => {
			const res = await clientApi.post<TApiResponse<any>>(
				`/api/v2/finance/transactions/withdraw/${encodeURIComponent(tradingAccountId)}`,
				body
			)
			return res.data
		},
	},
}
