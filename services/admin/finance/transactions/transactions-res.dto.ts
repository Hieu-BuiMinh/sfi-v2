export interface TBeneficiaryBank {
  beneficiary_bank_name: string
  beneficiary_account_name?: string
  beneficiary_account_number: string
  beneficiary_swift_code?: string
  beneficiary_particulars_name?: string
}

export interface TUser {
  id: string
  name: string
  email: string
  email_verified_at: number
  created_at: number
  updated_at: number
  status: number
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  auth0: string
  email_verified: number
  is_staff: number
  deleted_at: string | null
  avatar: string | null
  corporate_roles: string | null
  is_ekyc: number
  is_ekyc_status: string
}

export interface TEntity {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface TTransaction {
  id: string
  user_id: string
  trading_account_id: string
  status: number
  payment_type: number
  payment_method_id: string
  currency: string
  beneficiary_bank: TBeneficiaryBank | null
  payment_detail: string
  amount: string
  pod_upload_document: string | null
  created_at: number
  updated_at: number
  trading_account_group: string
  entity_id: string
  old_amount: string | null
  verified_amount: string | null
  docusign_id: string | null
  docusign_complete: string | null
  payment_platform: string
  payment_platform_method: string
  actual_amount: string | null
  standard_settlement_instruction_id: string | null
  purpose_of_transfer: string | null
  talos_transfer_id: string | null
  created_by_staff: string | null
  pow_upload_document: string | null
  entity: TEntity
  user: TUser
  sfid_deposit_approval?: TSfidApproval | null
  sfid_withdraw_approval?: TSfidApproval | null
  sfi_deposit_approval?: TSfidApproval | null
  sfi_withdraw_approval?: TSfidApproval | null
  processed_by: any
  received_amount: any
  received_currency: any
  finance_status: any
  user_processed: any
  binding_account: string | null
}

export interface TSfidApproval {
  id: string
  transaction_id: string
  user_updated_by: string
  user_updated_at: number
  user_approve: TUserApprove
}

export interface TUserApprove {
  id: string
  name: string
  email: string
  is_ekyc_status: string
}

export interface TDepositApproval {
  id: string
  transaction_id: string
  user_approval_status: number
  user_updated_by: string
  user_updated_at: number
  user_remarked: any
  created_at: number
  updated_at: number
  user_approve: TUserApprove
}

// TTransactionsListParams moved to transactions-req.dto.ts

export interface TTransactionsListResponse {
  current_page: number
  data: TTransaction[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}
export interface TVerifiedAmountRes {
  verified_amount: number
  exchange_rate: number | null
}

export interface TFirstDepositSfidData {
  id: string
  user_id: string
  trading_account_id: string
  status: number
  payment_type: number
  payment_method_id: string
  currency: string
  beneficiary_bank: TBeneficiaryBank
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
  sfid_deposit_approval: TSfidDepositApproval
}

export interface TSfidDepositApproval {
  id: string
  transaction_id: string
  user_updated_by: string
  user_updated_at: number
  user_approval_status: number
  user_approve: TUserApprove
}
