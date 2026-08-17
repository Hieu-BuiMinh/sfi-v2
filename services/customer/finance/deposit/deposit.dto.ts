export interface CreateDepositRequest {
  trading_account_id: string | number
  payment_type: number
  currency: string
  payment_method_id: string | number
  payment_detail: string
  amount: number | string
  pod_upload_document: any // file
  'beneficiary_bank[beneficiary_bank_name]': string
  'beneficiary_bank[beneficiary_account_name]': string
  'beneficiary_bank[beneficiary_account_number]': string
  'beneficiary_bank[beneficiary_swift_code]': string
  trading_account_group: string
}

export interface DepositBeneficiaryBank {
  id: string
  bank_id: string
  account_type: number
  status: number
  currency: string
  beneficiary_account_name: string
  beneficiary_account_number: string
  beneficiary_bank_branch_name: string
  beneficiary_bank_address?: string
  beneficiary_swift_code?: string
  bank_code?: string
  bank: {
    id: string
    name: string
    short_name: string
  }
}
