/* eslint-disable @typescript-eslint/no-explicit-any */
import { APPLICATION_STATUS, APPLICATION_TYPE } from '@/dto/enums/application'

export type TApplication = {
	id: string
	user_auth0: string
	status: APPLICATION_STATUS
	type_id: APPLICATION_TYPE
	entity_id: string
	content: any
	approved_at: any
	rejected_by: any
	reject_reason: any
	rejected_at: any
	created_at: string
	updated_at: string
	submitted_at: number
	docusign_complete: number
	docusign_id: any
	mt5_account: any
	binding_accounts: any
	deleted_at: any
	talos_account: any
	application_type: {
		id: string
		name: string
		slug: string
		created_at: string
		updated_at: string
	}
	application_documents: {
		id: string
		app_id: string
		folder_id: string
		type_id: string
		path: string
		created_at: string
		updated_at: string
		corporate_model: any
		url: string
		s3_url: any
		document_type: {
			id: string
			name: string
			slug: string
		}
	}[]
	application_entity: {
		id: string
		name: string
		slug: string
		created_at: string
		updated_at: string
	}
	application_products: {
		id: string
		name: string
		slug: string
		entity_id: string
		parent_id: any
		created_at: string
		updated_at: string
		pivot: {
			app_id: string
			product_id: string
		}
	}[]
	user: {
		id: string
		name: string
		email: string
		email_verified_at: number
		created_at: number
		updated_at: number
		status: number
		first_name: string
		last_name: string
		phone_number: any
		auth0: string
		email_verified: number
		is_staff: number
		deleted_at: any
		avatar: any
		corporate_roles: any
		is_ekyc: number
		is_ekyc_status: string
	}
}
export type TApplicationWorksheet = {
	id?: string
	application_id?: string
	customer_auth0?: any
	workflows?: {
		sfid?: string
		sfi?: string
	}
	created_at?: string
	updated_at?: string
	sales_workflow?: any
	onboarding_workflow?: any
	risk_workflow?: any
	compliance_workflow?: any
	sfvn_workflow?: any[]
	sfid_workflow?: {
		id?: string
		worksheet_id?: string
		approve_date?: string
		approve_by?: string
		approve_status?: number
		reject_message?: any
		revision_type?: {
			type?: number[]
			message?: string
		}[]
		revision_message?: string
		flow?: string
		created_at?: string
		updated_at?: string
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
