import { clientApi } from '@/lib/api/client'
import { TApiListResponse } from '@/dto/types/api.type'
import { TGetUsersListParams } from './users-req.dto'
import { TUserListItem } from './users-res.dto'

export const adminUserListService = {
	getUsersList: {
		key: (params: TGetUsersListParams) => ['get_admin_list_users', params] as const,
		get: async (params: TGetUsersListParams) => {
			const res = await clientApi.get<TApiListResponse<TUserListItem>>('/api/v1/list/users', {
				params,
			})
			return res.data
		},
	},
}
