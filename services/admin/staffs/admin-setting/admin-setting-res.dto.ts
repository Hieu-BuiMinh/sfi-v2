export interface TAdminSettingLogRolePivot {
	model_type: string
	model_id: string
	role_id: string
}

export interface TAdminSettingLogRole {
	id: string
	name: string
	guard_name: string
	created_at: string
	updated_at: string
	auth0_role_id: string
	pivot: TAdminSettingLogRolePivot
}

export interface TAdminSettingLogAdmin {
	id: string
	name: string
	email: string
	email_verified_at: number
	created_at: number
	updated_at: number
	status: number
	first_name: string | null
	last_name: string | null
	phone_number: string | null
	auth0: string
	email_verified: number
	is_staff: number
	deleted_at: string | null
	avatar: string | null
	is_ekyc: number
	is_ekyc_status: string
	roles: TAdminSettingLogRole[]
}

export interface TAdminSettingLogItem {
	id: string
	key: string
	old_value: string
	new_value: string
	modified_by: string
	modified_at: number
	created_at: string
	updated_at: string
	deleted_at: string | null
	admin: TAdminSettingLogAdmin
}

export interface TAdminSettingLogPaginationLink {
	url: string | null
	label: string
	active: boolean
}

export interface TAdminSettingLogsResponse {
	current_page: number
	data: TAdminSettingLogItem[]
	first_page_url: string
	from: number
	last_page: number
	last_page_url: string
	links: TAdminSettingLogPaginationLink[]
	next_page_url: string | null
	path: string
	per_page: number
	prev_page_url: string | null
	to: number
	total: number
}

export interface TAdminSetting {
	id: string
	key: string
	value: string
	created_at: string
	updated_at: string
	deleted_at: string | null
}
