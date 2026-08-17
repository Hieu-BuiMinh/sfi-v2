export interface GetNotificationListRequest {
  userId: string
  page?: number
  pageSize?: number
}

export interface MarkAsReadRequest {
  notificationId: string
  authId: string
}
