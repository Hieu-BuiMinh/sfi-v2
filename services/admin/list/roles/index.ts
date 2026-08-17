/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { TRolesResponse } from './roles-res.dto'

export const adminRolesService = {
	getUserRoles: {
		key: (params: { user_id: string; entity: string }) => ['get_admin_user_roles', params] as const,
		get: async (params: { user_id: string; entity: string }) => {
			const res = await clientApi.get<TApiResponse<TRolesResponse>>('/api/v1/list/roles', {
				params: { user_id: params.user_id },
			})
			const response = res.data

			if (response.data) {
				// Convert indexed object to array
				const rolesArray = Object.values(response.data) as any[]

				// Filter roles by name ending with _entity
				const filteredRoles = rolesArray.filter((role: any) => {
					if (!role.name) return false
					const suffix = `_${params.entity.toLowerCase()}`
					return role.name.toLowerCase().endsWith(suffix)
				})

				// Return filtered data as an array for easier consumption
				return {
					...response,
					data: filteredRoles,
				}
			}

			return response
		},
	},
}
