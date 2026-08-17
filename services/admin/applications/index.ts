/* eslint-disable @typescript-eslint/no-explicit-any */
import { TApplication, TApplicationDetailResponse } from './applications-res.dto'
import {
	CreateApplicationRequest,
	GetApplicationsRequest,
	GetUserApplicationsParams,
	UploadDocumentsRequest,
} from './applications-req.dto'
import { products } from '@/constants/products.const'
import { clientApi } from '@/lib/api/client'
import { TApiListResponse, TApiResponse } from '@/dto/types/api.type'

const TYPE_MAP: Record<string, string> = {
	individual: '1',
	corporate: '2',
	institutional: '3',
	ira: '4',
	joint: '5',
	llc: '6',
	partnership: '7',
	sole_proprietorship: '8',
	trust: '9',
}

export const adminApplicationService = {
	getApplicationsByAuth0Id: {
		key: ({ auth0Id }: GetUserApplicationsParams) => ['get_admin_applications_by_auth0_id', auth0Id] as const,
		get: async ({ auth0Id }: GetUserApplicationsParams) => {
			const res = await clientApi.get<TApiResponse<TApplication[]>>(`/api/v1/applications/users/${auth0Id}`)
			return res.data
		},
	},

	createApplication: {
		key: () => ['post_admin_create_application'] as const,
		post: async (data: { type: string; slug: string }) => {
			const type_id = TYPE_MAP[data.type] ?? '2'
			const product = products.find((p) => p.value === data.slug)

			if (!product) {
				throw new Error('Product not found')
			}

			const body: CreateApplicationRequest = {
				type_id,
				product_ids: [product.id],
				entity_id: product.entity_id,
			}

			const res = await clientApi.post<TApiResponse<TApplication[]>>('/api/v1/applications', body)
			return res.data
		},
	},

	deleteDraft: {
		key: ({ id }: { id: string | number }) => ['delete_admin_application_draft', id] as const,
		delete: async ({ id }: { id: string | number }) => {
			const res = await clientApi.delete<any>(`/api/v1/applications/draft/${id}`)
			return res.data
		},
	},

	updateApplication: {
		key: () => ['post_admin_update_application'] as const,
		post: async ({ data }: { data: TApplication }) => {
			const res = await clientApi.post<TApiResponse<TApplication>>(`/api/v1/applications`, data)
			return res.data
		},
	},

	uploadDocuments: {
		key: () => ['post_admin_upload_documents'] as const,
		post: async (params: UploadDocumentsRequest) => {
			const formData = new FormData()

			params.applicationIds.forEach((id) => {
				formData.append('application_ids[]', id)
			})

			params.documents.forEach((doc, index) => {
				formData.append(`documents[${index}][type_id]`, doc.typeId.toString())
				formData.append(`documents[${index}][file]`, doc.file)
			})

			const res = await clientApi.post<TApiResponse<TApplication[]>>(
				'/api/v1/applications/documents/upload',
				formData
			)
			return res.data
		},
	},

	deleteDocument: {
		key: ({ documentId }: { documentId: string }) => ['delete_admin_application_document', documentId] as const,
		delete: async ({ documentId }: { documentId: string }) => {
			const res = await clientApi.delete<TApiResponse<TApplication[]>>(
				`/api/v1/application-documents/${documentId}`
			)
			return res.data
		},
	},

	getApplications: {
		key: (params: GetApplicationsRequest) => ['get_admin_applications', params] as const,
		get: async (params: GetApplicationsRequest) => {
			const { page = 1, perPage = 10, ...rest } = params
			const res = await clientApi.get<TApiListResponse<TApplication>>(`/api/v1/applications`, {
				params: {
					...rest,
					page,
					perPage,
				},
			})
			return res.data
		},
	},

	getApplicationById: {
		key: (id: string) => ['get_admin_application_by_id', id] as const,
		get: async (id: string) => {
			const res = await clientApi.get<TApiResponse<TApplicationDetailResponse>>(`/api/v1/applications/${id}`)
			return res.data
		},
	},
}
