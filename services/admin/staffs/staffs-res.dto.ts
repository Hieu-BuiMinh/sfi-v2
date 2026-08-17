export interface TStaffPosition {
  id: string
  slug: string
  name: string
  created_at: number
  updated_at: number
}

export interface TStaffLocation {
  id: string
  slug: string
  name: string
}

export interface TStaffDepartmentLocation {
  id: string
  name: string
  slug: string
}

export interface TStaffDepartmentEntity {
  id: string
  name: string
  slug: string
}

export interface TStaffDepartment {
  id: string
  slug: string
  name: string
  created_at: number
  updated_at: number
  entity_id: string
  location_id: string
  description: string | null
  location: TStaffDepartmentLocation
  entity: TStaffDepartmentEntity
}

export interface TStaffDepartmentListItem {
  id: string
  slug: string
  location?: string
  entity: string
  name: string
  total_users: number
}

export interface TStaffManager {
  id: string
  name: string
  email: string
  is_ekyc_status: string
}

export interface TCreateStaffRole {
  id: string
  name: string
  guard_name: string
  created_at: string
  updated_at: string
  auth0_role_id: string
  pivot: {
    model_type: string
    model_id: string
    role_id: string
  }
}

export interface TCreateStaffResponseData {
  email: string
  status: boolean
  first_name: string
  last_name: string
  name: string
  phone_number: string
  is_staff: boolean
  id: string
  updated_at: number
  created_at: number
  is_ekyc_status: string
  roles: TCreateStaffRole[]
}

export interface TStaffDetailEmployeeProfile {
  id: string
  user_id: string
  created_at: number
  updated_at: number
  gender: string
  dob: number
  nationality: string
}

export interface TStaffDetailManager {
  id: string
  email: string
  name: string
  first_name?: string
  last_name?: string
  is_ekyc_status: string
  pivot: {
    user_id: string
    managed_by: string
  }
}

export interface TStaffDetailDepartment {
  id: string
  slug: string
  name: string
  created_at: number
  updated_at: number
  entity_id: string
  location_id?: string
  description: any
  pivot: {
    user_id: string
    department_id: string
  }
  location?: {
    id: string
    name: string
  }
  entity: {
    id: string
    name: string
  }
}

export interface TStaffDetailPosition {
  id: string
  name: string
  pivot: {
    user_id: string
    position_id: string
  }
}

export interface TStaffDetailSaleCode {
  id: string
  user_id: string
  code: string
}

export interface TStaffDetail {
  id: string
  name: string
  email: string
  email_verified_at: number
  created_at: number
  updated_at: number
  status: number
  first_name: string
  last_name: string
  phone_number: string
  auth0: string
  email_verified: number
  is_staff: number
  deleted_at: any
  avatar: any
  corporate_roles: any
  is_ekyc: number
  is_ekyc_status: string
  employee_profile: TStaffDetailEmployeeProfile
  managers: TStaffDetailManager[]
  departments: TStaffDetailDepartment[]
  positions: TStaffDetailPosition[]
  sale_codes: TStaffDetailSaleCode[]
}
export interface TStaffActivitiesResponse {
  current_page: number
  data: TStaffActivityItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: TStaffActivityLink[]
  next_page_url: any
  path: string
  per_page: number
  prev_page_url: any
  to: number
  total: number
}

export interface TStaffActivityItem {
  id: string
  actor_id: string
  event: string
  object_id: string
  ip_address: string
  timestamp: string
  actor_name: string
  actor_roles: string[]
  target_object: string
  old_values: any
  new_values: TStaffActivityNewValues
}

export interface TStaffActivityNewValues {
  email?: string
  name: string
  email_verified?: number
  auth0?: string
  email_verified_at?: string
  password?: string
  id?: string
  status?: boolean
  first_name?: string
  last_name?: string
  phone_number?: string
  is_staff?: boolean
}

export interface TStaffActivityLink {
  url?: string
  label: string
  active: boolean
}
