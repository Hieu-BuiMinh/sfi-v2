import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { TTransactionApprovalReq, TTransactionsListParams, TVerifiedAmountParams } from './transactions-req.dto'
import {
	TDepositApproval,
	TFirstDepositSfidData,
	TTransaction,
	TTransactionsListResponse,
	TVerifiedAmountRes,
} from './transactions-res.dto'

export const adminFinanceTransactionService = {
	getTransactionsList: {
		key: ({ accountLogin, params }: { accountLogin: string; params: TTransactionsListParams }) =>
			['get_admin_finance_transactions_list', accountLogin, params] as const,
		get: async ({ accountLogin, params }: { accountLogin: string; params: TTransactionsListParams }) => {
			const { page, per_page, payment_type, status, start_date, end_date } = params
			const res = await clientApi.get<TApiResponse<TTransactionsListResponse>>(
				`/api/v1/finance/transactions-list/${accountLogin}`,
				{
					params: {
						page,
						per_page,
						payment_type,
						status: status === 'all' || status === '' ? undefined : status,
						start_date: start_date || undefined,
						end_date: end_date || undefined,
					},
				}
			)
			return res.data
		},
	},

	getDepositTransactions: {
		key: (params: TTransactionsListParams) => ['get_admin_finance_deposit_transactions', params] as const,
		get: async (params: TTransactionsListParams) => {
			const res = await clientApi.get<TApiResponse<TTransactionsListResponse>>(
				'/api/v1/finance/transactions/list/deposit',
				{
					params,
				}
			)
			return res.data
		},
	},

	getWithdrawalTransactions: {
		key: (params: TTransactionsListParams) => ['get_admin_finance_withdrawal_transactions', params] as const,
		get: async (params: TTransactionsListParams) => {
			const res = await clientApi.get<TApiResponse<TTransactionsListResponse>>(
				'/api/v1/finance/transactions/list/withdraw',
				{ params }
			)
			return res.data
		},
	},
	getDepositApprovalHistory: {
		key: ({ entity_id, transaction_id }: { entity_id: string | number; transaction_id: string }) =>
			['get_deposit_approval_history', entity_id, transaction_id] as const,
		get: async ({ entity_id, transaction_id }: { entity_id: string | number; transaction_id: string }) => {
			const res = await clientApi.get<TApiResponse<TDepositApproval[]>>(
				`/api/v1/finance/entity/${entity_id}/payment-transaction-deposit-approval/${transaction_id}`
			)
			return res.data
		},
	},
	getWithdrawalApprovalHistory: {
		key: ({ entity_id, transaction_id }: { entity_id: string | number; transaction_id: string }) =>
			['get_withdrawal_approval_history', entity_id, transaction_id] as const,
		get: async ({ entity_id, transaction_id }: { entity_id: string | number; transaction_id: string }) => {
			const res = await clientApi.get<TApiResponse<TDepositApproval[]>>(
				`/api/v1/finance/entity/${entity_id}/payment-transaction-withdraw-approval/${transaction_id}`
			)
			return res.data
		},
	},
	getDepositTransactionDetail: {
		key: (id: string) => ['get_admin_finance_deposit_transaction_detail', id] as const,
		get: async (id: string) => {
			const res = await clientApi.get<TApiResponse<TTransaction>>(`/api/v1/finance/transactions/deposit/${id}`)
			return res.data
		},
	},
	getWithdrawalTransactionDetail: {
		key: (id: string) => ['get_admin_finance_withdrawal_transaction_detail', id] as const,
		get: async (id: string) => {
			const res = await clientApi.get<TApiResponse<TTransaction>>(`/api/v1/finance/transactions/withdraw/${id}`)
			return res.data
		},
	},

	updateTransactionApprovalStatus: {
		post: async (body: TTransactionApprovalReq) => {
			const { entity_id, transaction_id } = body
			const res = await clientApi.post<TApiResponse<TDepositApproval[]>>(
				`/api/v1/finance/entity/${entity_id}/payment-transaction-deposit-approval/${transaction_id}`,
				body
			)
			return res.data
		},
	},
	updateWithdrawalTransactionStatus: {
		post: async (body: TTransactionApprovalReq) => {
			const { entity_id, transaction_id } = body
			const res = await clientApi.post<TApiResponse<TDepositApproval[]>>(
				`/api/v1/finance/entity/${entity_id}/payment-transaction-withdraw-approval/${transaction_id}`,
				body
			)
			return res.data
		},
	},
	getVerifiedAmount: {
		key: (params: TVerifiedAmountParams) => ['get_verified_amount', params] as const,
		get: async (params: TVerifiedAmountParams) => {
			const res = await clientApi.get<TApiResponse<TVerifiedAmountRes>>(
				'/api/v1/finance/transactions/get-verified-amount',
				{
					params,
				}
			)
			return res.data
		},
	},
	getFirstDepositSfid: {
		key: ({ auth0Id }: { auth0Id: string }) => ['get_admin_first_deposit_sfid', auth0Id] as const,
		get: async ({ auth0Id }: { auth0Id: string }) => {
			const res = await clientApi.get<TApiResponse<TFirstDepositSfidData>>(
				`/api/v1/finance/transactions/first-deposit-sfid`,
				{
					params: { auth0_id: auth0Id },
				}
			)
			return res.data
		},
	},
}
