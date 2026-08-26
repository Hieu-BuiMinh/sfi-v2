import { TApiResponse } from '@/dto/types/api.type'
import { clientApi } from '@/lib/api/client'
import { TAdminSettingKey, TGetAdminSettingLogsParams, TUpdateAdminSettingRequest } from './admin-setting-req.dto'
import { TAdminSetting, TAdminSettingLogsResponse } from './admin-setting-res.dto'

export const adminStaffSettingService = {
	getLogs: {
		key: (params?: TGetAdminSettingLogsParams) =>
			params
				? (['get_admin_staffs_admin_setting_logs', params] as const)
				: (['get_admin_staffs_admin_setting_logs'] as const),
		get: async (params: TGetAdminSettingLogsParams) => {
			const res = await clientApi.get<TApiResponse<TAdminSettingLogsResponse>>(
				'/api/v1/staffs/admin-setting/logs',
				{ params }
			)
			return res.data
		},
	},

	getSetting: {
		key: (key: TAdminSettingKey) => ['get_admin_staffs_admin_setting', key] as const,
		get: async (key: TAdminSettingKey) => {
			const res = await clientApi.get<TApiResponse<TAdminSetting>>(`/api/v1/staffs/admin-setting/${key}`)
			return res.data
		},
	},

	update: {
		key: () => ['put_admin_staffs_admin_setting'] as const,
		put: async (data: TUpdateAdminSettingRequest) => {
			const res = await clientApi.put<TApiResponse<TAdminSetting>>('/api/v1/staffs/admin-setting', data)
			return res.data
		},
	},
}
