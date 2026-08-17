export interface TTransactionsListParams {
  page?: number | null
  per_page?: number | null
  payment_type?: string | null
  status?: number | string | null
  start_date?: number | null
  end_date?: number | null
  transaction_id?: string | null
}

export interface TTransactionApprovalReq {
  entity_id: string
  transaction_id: string
  user_approval_status: string | number
  user_remarked: string
  user_received_amount?: number | string | null
  user_verified_amount?: number | string | null
}
export interface TVerifiedAmountParams {
  amount: number
  quote_currency: string
  rate_type: number
  base_currency: string
}
