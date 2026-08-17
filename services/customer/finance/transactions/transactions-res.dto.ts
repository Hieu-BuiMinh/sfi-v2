export interface TransactionItem {
  id: string
  user_id: string
  trading_account_id: string
  status: number
  payment_type: number
  payment_method_id: string
  currency: string
  beneficiary_bank: {
    beneficiary_bank_name: string
    beneficiary_account_name: string
    beneficiary_account_number: string
    beneficiary_swift_code: string
  }
  payment_detail: string
  amount: string
  pod_upload_document: string
  created_at: number
  updated_at: number
  trading_account_group: string
  entity_id: string
  old_amount: any
  verified_amount: string
  docusign_id: any
  docusign_complete: any
  payment_platform: string
  payment_platform_method: string
  actual_amount: any
  standard_settlement_instruction_id: any
  purpose_of_transfer: any
  talos_transfer_id: any
  created_by_staff: any
  pow_upload_document: any
  entity: {
    id: string
    name: string
    slug: string
    created_at: string
    updated_at: string
  }
  user: {
    id: string
    name: string
    email: string
    email_verified_at: number
    created_at: number
    updated_at: number
    status: number
    first_name: string
    last_name: string
    phone_number: any
    auth0: string
    email_verified: number
    is_staff: number
    deleted_at: any
    avatar: any
    corporate_roles: any
    is_ekyc: number
    is_ekyc_status: string
  }
  [key: string]: any
}

export interface VerifiedAmountResponse {
  verified_amount: number
  exchange_rate: number | null
}
