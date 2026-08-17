export interface GetOrderHistoryParams {
  idLogin: string
  search?: string | null
  from?: number | string | null
  to?: number | string | null
  page?: string | number | null
  perPage?: string | number | null
  entity?: string | null
}
