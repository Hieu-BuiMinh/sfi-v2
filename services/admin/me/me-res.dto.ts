/* eslint-disable @typescript-eslint/no-explicit-any */
import { PortalUserRole } from '@/dto/enums/user'
import { UserRole } from '@/constants/sfi/user-roles.const'

export enum USER_KYC_STATUS {
	STATUS_NOT_STARTED = 0,
	STATUS_PASSED = 1,
	STATUS_FAILED = 2,
	STATUS_PENDING = 3,
	STATUS_PROCESSING = 4,
}

export type IUser = {
	id?: string
	status?: number
	email?: string
	name?: string
	first_name?: string
	last_name?: string
	created_at?: string
	updated_at?: string
	deleted_at?: string
	phone_number?: string
	auth0?: string
	is_staff?: PortalUserRole
	email_verified?: boolean
	email_verified_at?: boolean
	applications?: any
	login?: any
	roles?: UserRole[]
	employee_profile?: {
		department?: {
			id?: number
			name?: string
			slug?: string
		}
		location?: {
			id?: number
			name?: string
			slug?: string
		}
		position?: {
			id?: number
			name?: string
			slug?: string
		}
	}
	location_id?: string
	position_id?: string
	department_id?: string
	corporate_roles?: number | null
	corporate_roles_decoded?: string[] | null
	is_ekyc?: USER_KYC_STATUS
	corporate_application_id?: string
	corporate_users?: {
		application_id?: string
		company_name?: string
		decoded_roles?: string[]
	}[]
	avatar?: string
}

export type MeResponse = IUser
