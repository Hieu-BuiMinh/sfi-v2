/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import {
	TGetDepartmentsParams,
	TGetManagersParams,
	TCreateStaffRequest,
	TUpdateStaffRequest,
	TGetStaffActivitiesParams,
} from './staffs-req.dto'
import {
	TStaffDepartment,
	TStaffDepartmentListItem,
	TStaffLocation,
	TStaffManager,
	TStaffPosition,
	TCreateStaffResponseData,
	TStaffDetail,
	TStaffActivitiesResponse,
} from './staffs-res.dto'

export const adminStaffsService = {
	getPositions: {
		key: () => ['get_admin_staffs_positions'] as const,
		get: async () => {
			const res = await clientApi.get<TApiResponse<TStaffPosition[]>>('/api/v1/staffs/positions')
			return res.data
		},
	},

	getLocations: {
		key: () => ['get_admin_staffs_locations'] as const,
		get: async () => {
			const res = await clientApi.get<TApiResponse<TStaffLocation[]>>('/api/v1/staffs/locations')
			return res.data
		},
	},

	getManagersByDepartment: {
		key: (params: TGetManagersParams) => ['get_admin_staffs_managers', params] as const,
		get: async (params: TGetManagersParams) => {
			const res = await clientApi.get<TApiResponse<TStaffManager[]>>('/api/v1/staffs/manager', { params })
			return res.data
		},
	},

	getDepartments: {
		key: (params: TGetDepartmentsParams) => ['get_admin_staffs_departments', params] as const,
		get: async (params: TGetDepartmentsParams) => {
			const res = await clientApi.get<TApiResponse<TStaffDepartment[]>>('/api/v1/staffs/departments', { params })
			return res.data
		},
	},

	getDepartmentsList: {
		key: () => ['get_admin_staffs_departments_list'] as const,
		get: async () => {
			const res = await clientApi.get<TApiResponse<TStaffDepartmentListItem[]>>('/api/v1/staffs/departments/list')
			return res.data
		},
	},

	createStaff: {
		post: async (data: TCreateStaffRequest) => {
			const res = await clientApi.post<TApiResponse<TCreateStaffResponseData>>('/api/v1/staffs/new', data)
			return res.data
		},
	},

	updateStaff: {
		put: async (data: Omit<TUpdateStaffRequest, 'role'> & { corporate_roles?: any }) => {
			const { corporate_roles, ...rest } = data

			const rolePayload: Record<string, any> = {}
			let maxIndex = -1

			if (corporate_roles && typeof corporate_roles === 'object') {
				Object.entries(corporate_roles).forEach(([key, value]) => {
					rolePayload[key] = value
					const numericKey = parseInt(key, 10)
					if (!isNaN(numericKey) && numericKey > maxIndex) {
						maxIndex = numericKey
					}
				})
			}

			rolePayload[String(maxIndex + 1)] = {
				name: 'customer',
				isAssigned: true,
				label: 'customer',
			}
			rolePayload[String(maxIndex + 2)] = {
				name: 'trade_demo',
				isAssigned: true,
				label: 'trade_demo',
			}

			const finalPayload: TUpdateStaffRequest = {
				...rest,
				role: rolePayload,
			}

			const res = await clientApi.put<TApiResponse<any>>('/api/v1/staffs/update', finalPayload)
			return res.data
		},
	},

	getStaffById: {
		key: ({ id }: { id: string }) => ['get_admin_staff_by_id', id] as const,
		get: async ({ id }: { id: string }) => {
			const res = await clientApi.get<TApiResponse<TStaffDetail>>(`/api/v1/staffs/${id}`)
			return res.data
		},
	},

	getActivities: {
		key: (params: TGetStaffActivitiesParams) => ['get_admin_staff_activities', params] as const,
		get: async ({ id, ...params }: TGetStaffActivitiesParams) => {
			const res = await clientApi.get<TApiResponse<TStaffActivitiesResponse>>(`/api/v1/staffs/${id}/activities`, { params })
			return res.data
		},
	},
}
