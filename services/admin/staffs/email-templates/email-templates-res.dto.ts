export interface TEmailTemplateVariable {
	key: string
	label: string
	example: string
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
	sample_data: Record<string, unknown>
	available_variables: TEmailTemplateVariable[]
	attachments: unknown[] | null
	is_active: boolean
	created_by: string
	updated_by: string
	created_at: string
	updated_at: string
	deleted_at: string | null
	unlayer_design: Record<string, unknown>
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
	unlayer_design: Record<string, unknown>
}

export interface TEmailTemplateDetail extends TEmailTemplate {
	histories: TEmailTemplateHistory[]
	unlayer_project_id: string | null
}
