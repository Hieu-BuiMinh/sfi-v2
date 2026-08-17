import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { MeResponse } from './me-res.dto'

export const adminMeService = {
	getUserProfile: {
		key: () => ['get_admin_user_profile'] as const,
		get: async () => {
			const res = await clientApi.get<TApiResponse<MeResponse>>(`/api/v1/me`)
			return res.data
		},
	},
}
