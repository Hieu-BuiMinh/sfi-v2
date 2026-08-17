import { ERateStatus, ERateType } from './rates-res.dto'

export type TRateType = 'deposit' | 'withdrawal'

export type TRateView = 'current' | 'history'

export interface TRateListParams {
  type: ERateType | number
  view: TRateView
  page?: number
  per_page?: number
}

export interface TRateCreateParams {
  rate_type: ERateType | number
  base_currency: string
  quote_currency: string
  exchange_rate: number
  effective_date: string
  status: ERateStatus | number
  note?: string
}

export interface TRateUpdateParams extends TRateCreateParams {
  id: string | number
}

export interface TRateStatusUpdateParams {
  id: string | number
  status: ERateStatus | number
}
