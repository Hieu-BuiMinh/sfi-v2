/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientApi } from '@/lib/api/client'
import { TSfiFlowData } from '@/services/admin/sfi/flow/sfi-flow-res.dto'
import { TSfiFlowOperationReq } from '@/services/admin/sfi/flow/sfi-flow-req.dto'
import { TApiResponse } from '@/dto/types/api.type'

export const adminSfiFlowService = {
	getOperationFlow: {
		key: (id: string) => ['get_admin_sfi_operation_flow', id] as const,
		get: async (id: string) => {
			const res = await clientApi.get<TApiResponse<TSfiFlowData>>(`/api/v1/sfi/flow/${id}/sfi_operation`)
			return res.data
		},
	},

	getRiskFlow: {
		key: (id: string) => ['get_admin_sfi_risk_flow', id] as const,
		get: async (id: string) => {
			const res = await clientApi.get<TApiResponse<TSfiFlowData>>(`/api/v1/sfi/flow/${id}/sfi_risk`)
			return res.data
		},
	},

	submitOperation: {
		post: async ({
			id,
			flowType,
			data,
		}: {
			id: string
			flowType: 'sfi_operation' | 'sfi_risk'
			data: TSfiFlowOperationReq
		}) => {
			const res = await clientApi.post<TApiResponse<any>>(`/api/v1/sfi/flow/${id}/${flowType}`, data)
			return res.data
		},
	},
}
