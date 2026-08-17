export interface GetCustomersRequest {
  page?: number | string | null
  perPage?: number | string | null
  search?: string | null
  entity_slug?: string | null
  type_slug?: string | null
  from_date?: string | null
  to_date?: string | null
}
