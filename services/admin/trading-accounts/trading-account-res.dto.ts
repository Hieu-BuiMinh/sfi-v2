export interface TBindTradingAccountRes {
  platform: string
  type: string
  account_id: string
  email: string
  group: any
  entity: string
  status: boolean
  id: string
  updated_at: string
  created_at: string
}

export interface TTradingAccountItem {
  id: string
  platform: string
  type: string
  account_id: string
  email: string
  group: string
  status: boolean
  created_at: string
  updated_at: string
  balance: string
  currency: string
  entity: string
  binding_account: any
  display_name: any
  equity: string
  crm_balance: string
}
export interface TAtpIdUpdateRes {
  application: any
  trading_account: TTradingAccountItem
}
