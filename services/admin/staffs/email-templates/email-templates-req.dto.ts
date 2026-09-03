export type TEmailTemplateCategory = 'snippet' | 'email'

export interface TGetEmailTemplatesParams {
	page: number
	per_page: number
	category?: TEmailTemplateCategory
	language?: 'eng' | 'idn'
	search?: string
	sort_by: string
	sort_order: 'asc' | 'desc'
	lang: string
}

export interface TGetEmailTemplateDetailParams {
	id: string
}

export interface TPreviewEmailTemplateParams {
	id: string
}

export interface TPreviewEmailTemplateRequest {
	blade_content: string
	html_content: string
	subject: string
	to: string[]
	cc: string[]
	bcc: string[]
	sample_data: Record<string, unknown>
}

export interface TUpdateEmailTemplateRequest {
	name?: string
	subject?: string
	title?: string
	logo_url?: string | null
	to?: string[]
	cc?: string[]
	bcc?: string[]
	description?: string
	blade_content?: string
	html_content?: string
	unlayer_design?: Record<string, unknown> | null
	is_active?: boolean
	sample_data?: Record<string, unknown>
	attachments?: unknown[]
	change_note?: string
}

export interface TSendTestEmailRequest {
	recipient_email: string
	blade_content: string
	subject: string
	to: string[]
	cc: string[]
	bcc: string[]
	include_cc_bcc: boolean
	sample_data: Record<string, unknown>
}

export interface TUploadEmailTemplateAttachmentParams {
	id: string
	file: File
}

export interface TDeleteEmailTemplateAttachmentParams {
	id: string
	index: number
}
