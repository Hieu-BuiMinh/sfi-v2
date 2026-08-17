import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { DashboardBlockData } from './dashboard-res.dto'

export const dashboardService = {
	getDashboardBlock: {
		key: () => ['get_dashboard_block'],
		get: async () => {
			const res = await clientApi.get<TApiResponse<DashboardBlockData>>(`/api/v1/dashboard/get-block`)
			return res.data
		},
	},
}
