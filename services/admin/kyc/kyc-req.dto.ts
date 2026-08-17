/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UploadKycDocumentsRequest {
	application_id: string
	type_id: string
	file: File
}

export interface UploadKycJsonRequest {
	type_id: string
	content: {
		city?: string
		country?: string
		dob?: string
		first_name?: string
		last_name?: string
		full_name?: string
		id_number?: string
		nationality?: string
		phone_number?: string
		postal_code?: string
		residential_address?: string
		application_id?: string
		[key: string]: any
	}
	application_id: string
}

export interface CheckFacialStatusRequest {
	reference: string
}
