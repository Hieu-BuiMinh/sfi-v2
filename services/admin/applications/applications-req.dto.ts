export interface UpdateApplicationRequest {
	data: unknown
}

export interface CreateApplicationRequest {
  type_id: string
  product_ids: string[]
  entity_id: string
}

export interface CreateCorporateManualRequest {
	company_name: string
	country_of_incorporation: string
	business_registration_number?: string
	nature_of_business: string
	business_address?: string
	estimated_annual_revenue_range?: string
	full_name: string
	position_title: string
	email_address: string
	mobile_number: string
	preferred_contact_method: string
}

export interface UploadDocumentsRequest {
  applicationIds: string[]
  documents: Array<{
    typeId: number
    file: File
  }>
}

export interface GetUserApplicationsParams {
  auth0Id: string
}

export interface GetApplicationsRequest {
  search?: string | null
  page?: number | null
  perPage?: number | null
  created_from?: string | null
  created_to?: string | null
  status?: string | null
}
