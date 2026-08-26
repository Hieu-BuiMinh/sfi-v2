'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(15),
	category: parseAsStringLiteral(['all', 'email', 'snippet'] as const).withDefault('all'),
	language: parseAsStringLiteral(['all', 'eng', 'idn'] as const).withDefault('all'),
	search: parseAsString,
	sort_by: parseAsString.withDefault('category'),
	sort_order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('asc'),
}

export function useEmailTemplatesTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'email_templates_page',
			per_page: 'email_templates_per_page',
			category: 'email_templates_category',
			language: 'language',
			search: 'search',
			sort_by: 'email_templates_sort_by',
			sort_order: 'email_templates_sort_order',
		},
	})
}
