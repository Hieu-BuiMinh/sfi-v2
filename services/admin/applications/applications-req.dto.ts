export interface UpdateApplicationRequest {
  data: any // Keeping as any for now to match old implementation or use TApplication
}

export interface CreateApplicationRequest {
  type_id: string
  product_ids: string[]
  entity_id: string
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
