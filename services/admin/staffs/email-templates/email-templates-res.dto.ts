export interface TEmailTemplateVariable {
	key: string
	label: string
	example: string
}

export interface TEmailTemplateAttachment {
	disk: string
	name: string
	path: string
	size: number
	mime_type: string
}

import { TEmailTemplateCategory } from './email-templates-req.dto'

export interface TEmailTemplate {
	id: string
	slug: string
	name: string
	category: TEmailTemplateCategory
	language: string
	subject: string | null
	to: string[]
	cc: string[]
	bcc: string[]
	blade_content: string
	description: string
	sample_data: Record<string, unknown> | null
	available_variables: TEmailTemplateVariable[]
	attachments: TEmailTemplateAttachment[] | null
	is_active: boolean
	created_by: string
	updated_by: string
	created_at: string
	updated_at: string
	deleted_at: string | null
	unlayer_design: Record<string, unknown> | null
}

export interface TEmailTemplateList {
	data: TEmailTemplate[]
	total: number
	current_page: number
	per_page: number
	last_page: number
}

export interface TEmailTemplateHistory {
	id: string
	email_template_id: string
	slug: string
	subject: string
	to: string[]
	cc: string[]
	bcc: string[]
	blade_content: string
	modified_by: string
	change_note: string
	created_at: string
	updated_at: string
	deleted_at: string | null
	unlayer_design: Record<string, unknown> | null
}

export interface TEmailTemplateDetail extends TEmailTemplate {
	histories: TEmailTemplateHistory[]
	unlayer_project_id: string | null
}

export interface TUpdateEmailTemplateResponse extends TEmailTemplate {
	histories: TEmailTemplateHistory[]
}

export interface TSendTestEmailResponse {
	sent_to: string
}

export interface TEmailTemplateAttachmentsResponse {
	attachments: TEmailTemplateAttachment[]
}

export interface TPreviewEmailTemplateResponse {
	success: boolean
	error?: string
	rendered_subject: string
	rendered_html: string
	rendered_to: string[]
	rendered_cc: string[]
	rendered_bcc: string[]
	raw_to: string[]
	raw_cc: string[]
	raw_bcc: string[]
}
