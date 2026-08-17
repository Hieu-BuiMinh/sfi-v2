export interface TRoleResponse {
  current_page: number
  data: TRoleItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: TRoleLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface TRoleItem {
  name: string
}

export interface TRoleLink {
  url?: string
  label: string
  active: boolean
}
