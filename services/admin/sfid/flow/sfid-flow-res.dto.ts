export enum ESfidFlowStatus {
  PENDING = 1,
  PROCESSING = 2,
  APPROVE = 3,
  REJECT = 4,
  FAILED = 5,
}

export interface TSfidFlowData {
  id: string
  worksheet_id: string
  approve_date: string
  approve_by: string
  approve_status: ESfidFlowStatus | number
  reject_message: any
  revision_type: any
  revision_message: any
  flow: string
  created_at: string
  updated_at: string
  staff: any
  approver: TSfidApprover
  worksheet: TSfidWorksheet
}

export interface TSfidApprover {
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
  avatar: string
  corporate_roles: any
  is_ekyc: number
  is_ekyc_status: string
}

export interface TSfidWorksheet {
  id: string
  application_id: string
  customer_auth0: any
  workflows: {
    sfid: string
  }
  created_at: string
  updated_at: string
  application: TSfidApplication
}

export interface TSfidApplication {
  id: string
  user_auth0: string
  status: number
  type_id: string
  entity_id: string
  content: any
  approved_at: any
  rejected_by: any
  reject_reason: any
  rejected_at: any
  created_at: string
  updated_at: string
  submitted_at: number
  docusign_complete: number
  docusign_id: any
  mt5_account: TSfidMt5Account[]
  binding_accounts: {
    atp_id_number: string
  }
  deleted_at: any
  talos_account: any
}

export interface TSfidMt5Account {
  Login: string
  Group: string
  Balance: number
}
