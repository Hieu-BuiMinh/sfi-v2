/* eslint-disable @typescript-eslint/no-explicit-any */
import { APPLICATION_STATUS } from '@/dto/enums/application'

export interface TCustomerApplicationListItem {
	id: string
	user_auth0: string
	status: APPLICATION_STATUS
	type_id: string
	entity_id: string
	content: {
		nationality?: string
		[key: string]: any
	}
	approved_at: any
	rejected_by: any
	reject_reason: any
	rejected_at: any
	created_at: string
	updated_at: string
	submitted_at?: number
	docusign_complete: number
	docusign_id: any
	mt5_account?: any[]
	binding_accounts?: {
		atp_id_number: string
	}
	deleted_at: any
	talos_account: any
	application_entity: {
		id: string
		name: string
		slug: string
	}
	application_type: {
		id: string
		name: string
		slug: string
	}
	user: {
		id: string
		name: string
		email: string
		first_name: any
		last_name: any
		auth0: string
		[key: string]: any
	}
}

export interface TCustomerProfileResponse {
	id: string
	name: string
	email: string
	email_verified_at: number
	created_at: number
	updated_at: number
	status: number
	first_name: any
	last_name: any
	phone_number: any
	auth0: string
	email_verified: number
	is_staff: number
	deleted_at: any
	avatar: any
	corporate_roles: any
	is_ekyc: number
	is_ekyc_status: string
	applications: TCustomerProfileApplication[]
	customer_profile: any
}

export interface TCustomerProfileApplication {
	id: string
	user_auth0: string
	status: number
	type_id: string
	entity_id: string
	content: TCustomerProfileContent
	approved_at: any
	rejected_by: any
	reject_reason: any
	rejected_at: any
	created_at: string
	updated_at: string
	submitted_at: any
	docusign_complete: number
	docusign_id: any
	mt5_account: any
	binding_accounts: any
	deleted_at: any
	talos_account: any
	application_entity: {
		id: string
		name: string
		slug: string
	}
	application_type: {
		id: string
		name: string
		slug: string
	}
	worksheet: any
}

export interface TCustomerProfileContent {
	nationality: string
	declare_nationality: {
		time_save: string
	}
	customer_particular: {
		personal_information: {
			full_name: string
			gender: string
			birthday: string
			place_birth: string
			email: string
			phone: string
			selectedCountry: string
			id_address: string
			postal_code: string
			city: string
			marriage_status: string
			home_address_regency_code: string
			home_address_postal_code: string
			home_ownership_status: string
			current_address_postal_code: string
			emergency_contact_name: string
			emergency_phone: string
			relationship_with_customer: string
			relationship_with_customer_other: any
			mother_maiden_name: string
		}
		time_save: string
		job_details: {
			type_job: string
			annual_income: string
			source_of_fund: string
			experience_in_trading: string
			company_address: any
			length_of_work: string
			year_of_tradding: string
			company_name: any
			company_job_title: any
		}
		bank_account: {
			bank_branch_name: string
			full_name: string
			account_number: string
		}
		identify_verification: {
			verification_document: string
			ktp_or_passport: string
			indonesia_identity_number: string
		}
	}
}
