export enum PAYMENT_METHOD_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
}

export const PAYMENT_METHOD_STATUS_TEXT: Record<PAYMENT_METHOD_STATUS, string> =
  {
    [PAYMENT_METHOD_STATUS.INACTIVE]: 'Inactive',
    [PAYMENT_METHOD_STATUS.ACTIVE]: 'Active',
  }

export enum PAYMENT_METHOD_TYPE {
  WIRE = 1,
  DOMESTIC = 2,
}

export const PAYMENT_METHOD_TYPE_TEXT: Record<PAYMENT_METHOD_TYPE, string> = {
  [PAYMENT_METHOD_TYPE.WIRE]: 'Wire',
  [PAYMENT_METHOD_TYPE.DOMESTIC]: 'Domestic',
}

export enum PAYMENT_ACCOUNT_TYPE {
  INDIVIDUAL = 1,
  CORPORATE = 2,
}

export const PAYMENT_ACCOUNT_TYPE_TEXT: Record<PAYMENT_ACCOUNT_TYPE, string> = {
  [PAYMENT_ACCOUNT_TYPE.INDIVIDUAL]: 'Individual',
  [PAYMENT_ACCOUNT_TYPE.CORPORATE]: 'Corporate',
}

export interface PaymentMethodItem {
  id: string
  bank_id: string
  account_type: PAYMENT_ACCOUNT_TYPE
  status: PAYMENT_METHOD_STATUS
  currency: string
  beneficiary_account_name: string
  beneficiary_account_number: string
  beneficiary_bank_branch_name: string
  beneficiary_bank_address?: string
  beneficiary_swift_code?: string
  correspondent_bank_name?: string
  correspondent_account_number?: string
  correspondent_swift_code?: string
  created_at: string
  updated_at: string
  user_id: string
  entity_id: string
  method: PAYMENT_METHOD_TYPE
  bank_code?: string
  free_text_bank: any
  bank: Bank
  user: User
  entity: Entity
}

export interface Bank {
  id: string
  name: string
  short_name: string
}

export interface User {
  id: string
  name: string
  email: string
  email_verified_at: number
  created_at: number
  updated_at: number
  status: number
  first_name: string
  last_name: string
  phone_number: string
  auth0: string
  email_verified: number
  is_staff: number
  deleted_at: any
  avatar: string
  corporate_roles: any
  is_ekyc: number
  is_ekyc_status: string
}

export interface Entity {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface PaymentMethodReq {
  account_type: string
  status: string
  currency: string
  bank_id: string
  beneficiary_account_name: string
  beneficiary_account_number: string
  beneficiary_bank_branch_name: string
  beneficiary_bank_address?: string
  beneficiary_swift_code?: string
  bank_code?: string
  correspondent_bank_name?: string
  correspondent_account_number?: string
  correspondent_swift_code?: string
  entity_id: string
  method: number
  user_id: string
}
