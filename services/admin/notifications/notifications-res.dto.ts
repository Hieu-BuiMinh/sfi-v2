export interface IRecipient {
  body: string
  channel: string
  device_id: string
  email: string
  email_bcc: string
  email_cc: string
  email_to: string
  entity_source: string
  image: string
  platform: string
  title: string
  user_id: string
}

export interface INotification {
  id: string
  messageId: string
  isRead: boolean
  checked: boolean
  title: string
  body: string
  image: string
  channel: string
  recipient?: IRecipient
  createdAt: number
  updatedAt: number
}

export interface NotificationListResponse {
  list: INotification[]
  total: number
  total_unread: number
}
