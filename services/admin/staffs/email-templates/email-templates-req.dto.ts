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
