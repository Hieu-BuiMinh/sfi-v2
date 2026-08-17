export interface TAuth0LogItem {
  user_id: string
  type: string
  ip: string
  date: string
}

export interface TAuth0GetLogsResponse {
  data: TAuth0LogItem[]
  total: number
  per_page: string | number
  page: string | number
  last_page: number
  from: number
  has_next_page: boolean
}
