export interface TRoleManager {
  id: string
  email: string
  name: string
  is_ekyc_status: string
}

export interface TRoleItem {
  id: string
  name: string
  isAssigned: boolean
  manager: TRoleManager[] | null
}

export type TRolesResponse = TRoleItem[]
