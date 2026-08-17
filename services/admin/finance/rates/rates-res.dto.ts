export enum ERateType {
  DEPOSIT = 1,
  WITHDRAWAL = 2,
}

export enum ERateStatus {
  DISABLE = 0,
  ENABLE = 1,
}

export interface TRateItem {
  id: string
  entity: string
  rate_type: ERateType | number
  base_currency: string
  quote_currency: string
  exchange_rate: number
  effective_date: number
  status: ERateStatus | number
  note: string
  created_at: number
  updated_at: number
  rn: number
}

export interface TRateListResponse {
  current_page: number
  data: TRateItem[]
  total: number
  per_page: number
  last_page: number
  from: number
  to: number
}
