/* eslint-disable @typescript-eslint/no-explicit-any */
import { TApiResponse } from '@/dto/types/api.type'
import { TApplication, TApplicationWorksheet } from './applications-res.dto'
import { clientApi } from '@/lib/api/client'

export const customerApplicationService = {
	getApplicationsByAuth0Id: {
		key: ({ auth0Id }: { auth0Id: string }) => ['get_customer_applications_by_auth0_id', auth0Id] as const,
		get: async ({ auth0Id }: { auth0Id: string }) => {
			const res = await clientApi.get<TApiResponse<TApplication[]>>(`/api/v1/applications/users/${auth0Id}`)
			return res.data
		},
	},

	deleteApplication: {
		key: ({ id }: { id: string }) => ['delete_customer_application', id] as const,
		delete: async ({ id }: { id: string }) => {
			const res = await clientApi.delete<any>(`/api/v1/applications/draft/${id}`)
			return res.data
		},
	},

	getApplicationById: {
		key: ({ id }: { id: string }) => ['get_customer_application_by_id', id] as const,
		get: async ({ id }: { id: string }) => {
			const res = await clientApi.get<
				TApiResponse<{
					application: TApplication
					worksheet?: TApplicationWorksheet
				}>
			>(`/api/v2/applications/${id}`)
			return res.data
		},
	},

	uploadDocument: async (ids: string[], data: FormData) => {
		ids.forEach((id) => {
			data.append('application_ids[]', id)
		})
		const res = await clientApi.post(`/api/v1/applications/documents/upload`, data)
		return res.data
	},

	deleteDocument: async (id: string) => {
		const res = await clientApi.delete(`/api/v1/application-documents/${id}`)
		return res.data
	},
}
