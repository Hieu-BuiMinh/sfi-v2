export interface TUserListItem {
  id: string
  name: string
  email: string
  email_verified_at?: number
  created_at: number
  updated_at: number
  status: number
  first_name: string
  last_name: string
  phone_number: string
  auth0?: string
  email_verified: number
  is_staff: number
  deleted_at: any
  avatar?: string
  corporate_roles: any
  is_ekyc: number
  is_ekyc_status: string
  managers: TManager[]
  departments: TDepartment[]
  positions: TPosition[]
  sale_codes: TSaleCode[]
}

export interface TManager {
  id: string
  name: string
  email: string
  email_verified_at?: number
  created_at: number
  updated_at: number
  status: number
  first_name?: string
  last_name?: string
  phone_number?: string
  auth0?: string
  email_verified: number
  is_staff: number
  deleted_at: any
  avatar?: string
  corporate_roles: any
  is_ekyc: number
  is_ekyc_status: string
  pivot: TPivot
}

export interface TPivot {
  user_id: string
  managed_by: string
}

export interface TDepartment {
  id: string
  slug: string
  name: string
  created_at: number
  updated_at: number
  entity_id: string
  location_id?: string
  description: any
  pivot: TPivot2
}

export interface TPivot2 {
  user_id: string
  department_id: string
}

export interface TPosition {
  id: string
  slug: string
  name: string
  created_at: number
  updated_at: number
  pivot: TPivot3
}

export interface TPivot3 {
  user_id: string
  position_id: string
}

export interface TSaleCode {
  id: string
  user_id: string
  code: string
  created_at: number
  updated_at: number
}
