/* eslint-disable @typescript-eslint/no-explicit-any */
import { TApplication as TCustomerApplication } from '@/services/customer/applications/applications-res.dto'

export interface TApplication extends Omit<TCustomerApplication, 'user'> {
	user?: {
		id?: string
		name?: string
		email?: string
		email_verified_at?: number
		created_at?: number
		updated_at?: number
		status?: number
		first_name?: string
		last_name?: string
		phone_number?: any
		auth0?: string
		email_verified?: number
		is_staff?: number
		deleted_at?: any
		avatar?: any
		corporate_roles?: any
		is_ekyc?: number
		is_ekyc_status?: string
	}
}

export interface TWorksheet {
	id: string
	application_id: string
	customer_auth0: string | null
	workflows: Record<string, string>
	created_at: string
	updated_at: string
	sfid_workflow: {
		id: string
		worksheet_id: string
		approve_date: string | null
		approve_by: string | null
		approve_status: number
		reject_message: string | null
		revision_type: string | null
		revision_message: string | null
		flow: string
		created_at: string
		updated_at: string
	}[]
	sfi_workflow: {
		id: string
		worksheet_id: string
		approve_date: string | null
		approve_by: string | null
		approve_status: number
		reject_message: string | null
		revision_type: string | null
		revision_message: string | null
		flow: string
		created_at: string
		updated_at: string
	}[]
}

export interface TApplicationDetailResponse {
	application: TApplication
	worksheet: TWorksheet
}
