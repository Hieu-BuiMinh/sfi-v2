export type TAdminSettingCurrency = 'USD' | 'IDR'
export type TAdminSettingKey = 'usd_minimum_balance' | 'idr_minimum_balance'

export interface TGetAdminSettingLogsParams {
	page: number
	per_page: number
	lang: string
}

export interface TUpdateAdminSettingRequest {
	key: TAdminSettingKey
	old_value: string
	new_value: string
}
