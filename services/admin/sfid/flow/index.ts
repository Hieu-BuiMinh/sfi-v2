/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientApi } from '@/lib/api/client'
import { TSfidFlowData } from '@/services/admin/sfid/flow/sfid-flow-res.dto'
import { TSfidFlowOperationReq } from '@/services/admin/sfid/flow/sfid-flow-req.dto'
import { TApiResponse } from '@/dto/types/api.type'

export const adminSfidFlowService = {
	getOperationFlow: {
		key: (id: string) => ['get_admin_sfid_operation_flow', id] as const,
		get: async (id: string) => {
			const res = await clientApi.get<TApiResponse<TSfidFlowData>>(`/api/v1/sfid/flow/${id}/sfid_operation`)
			return res.data
		},
	},

	getRiskFlow: {
		key: (id: string) => ['get_admin_sfid_risk_flow', id] as const,
		get: async (id: string) => {
			const res = await clientApi.get<TApiResponse<TSfidFlowData>>(`/api/v1/sfid/flow/${id}/sfid_risk`)
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
			flowType: 'sfid_operation' | 'sfid_risk'
			data: TSfidFlowOperationReq
		}) => {
			const res = await clientApi.post<TApiResponse<any>>(`/api/v1/sfid/flow/${id}/${flowType}`, data)
			return res.data
		},
	},
}
