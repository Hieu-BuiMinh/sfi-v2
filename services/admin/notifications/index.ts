import { clientApi } from '@/lib/api/client'
import { TApiResponse } from '@/dto/types/api.type'
import { GetNotificationListRequest, MarkAsReadRequest } from './notifications-req.dto'
import { NotificationListResponse } from './notifications-res.dto'

export const adminNotificationService = {
	getNotificationList: {
		key: (params: GetNotificationListRequest) => ['get_admin_notification_list', params.userId] as const,
		get: async (params: GetNotificationListRequest) => {
			const res = await clientApi.get<TApiResponse<NotificationListResponse>>(
				`/api/v1/notifications/details?page=${params.page}&page_size=${params.pageSize}`
			)
			return res.data
		},
	},

	markAsRead: {
		key: () => ['post_admin_mark_notification_as_read'] as const,
		post: async ({ notificationId, authId }: MarkAsReadRequest) => {
			const res = await clientApi.post<TApiResponse<null>>(`/api/v1/notifications/${notificationId}/read`, {
				notification_id: notificationId.toString(),
				auth_id: authId,
			})
			return res.data
		},
	},
}
