import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { TGetRolesParams } from './roles-req.dto'
import { TRoleResponse } from './roles-res.dto'

export const adminRolesService = {
	getRoles: {
		key: (params: TGetRolesParams) => ['get_admin_roles', params],
		get: async (params: TGetRolesParams) => {
			const { perPage: per_page, ...rest } = params
			const res = await clientApi.get<TApiResponse<TRoleResponse>>('/api/v1/roles', {
				params: { ...rest, per_page },
			})
			return res.data
		},
	},
}
