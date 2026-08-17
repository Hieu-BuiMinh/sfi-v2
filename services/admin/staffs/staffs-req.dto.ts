export interface TGetDepartmentsParams {
  location: string
}

export interface TGetManagersParams {
  department: string
}

export interface TCreateStaffRequest {
  first_name: string
  last_name: string
  department_id: string
  position_slug: string
  manager_id: string
  email: string
  phone_number: string
  profile: {
    gender: string
    date_of_birth: number
    nationality: string
  }
}

export interface TUpdateStaffRequest {
  user_id: string
  first_name: string
  last_name: string
  status: number
  email: string
  phone_number: string
  profile: {
    gender: string
    date_of_birth: number
    nationality: string
  }
  role?: Record<
    string,
    { name: string; manager_id?: string; isAssigned?: boolean; label?: string }
  >
}
export interface TGetStaffActivitiesParams {
  id: string
  search?: string | null
  from?: string | null
  to?: string | null
  event?: string | null
  page?: number | null
  perPage?: number | null
}
