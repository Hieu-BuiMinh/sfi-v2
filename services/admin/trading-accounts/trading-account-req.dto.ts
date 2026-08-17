export interface TBindTradingAccountReq {
  platform: string
  type: string
  account_id: string
  email: string
  group: string
}

export interface TUpdateTradingAccountReq {
  status: boolean
  email: string
}

export interface TAtpIdUpdateReq {
  application_id: string
  atp_id_number: string
}
