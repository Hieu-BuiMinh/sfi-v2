export interface GetTransactionsParams {
  id: string | number
  page?: number | string
  perPage?: number | string
  created_date?: string | null
  status?: string | number | null
  search?: string | null
}

export interface GetVerifiedAmountParams {
  amount: number | string
  quote_currency: string
  base_currency: string
  rate_type?: number | string
}
export interface CreateWithdrawalRequest {
  trading_account_id: string | number
  payment_type: number
  currency: string
  payment_method_id: string | number
  payment_detail: string
  amount: number | string
  beneficiary_bank: {
    beneficiary_particulars_name: string
    beneficiary_bank_name: string
    beneficiary_account_number: string | number
  }
  trading_account_group: string
}
