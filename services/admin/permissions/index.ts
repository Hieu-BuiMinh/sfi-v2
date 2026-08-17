import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { TGetPermissionsParams, TUpdatePermissionsParams } from './permissions-req.dto'
import { TPermissionsResponse } from './permissions-res.dto'

export const adminPermissionsService = {
	getPermissions: {
		key: (params: TGetPermissionsParams) => ['get_admin_permissions', params],
		get: async (params: TGetPermissionsParams) => {
			const res = await clientApi.get<TApiResponse<TPermissionsResponse>>('/api/v1/permissions', { params })
			return res.data
		},
	},

	updatePermissions: {
		put: async (data: TUpdatePermissionsParams) => {
			const res = await clientApi.put<TApiResponse<null>>('/api/v1/permissions/update-for-role', data)
			return res.data
		},
	},
}
