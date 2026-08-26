'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(10),
	search: parseAsString,
}

export function useRolesTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: { page: 'roles_page', per_page: 'roles_per_page', search: 'roles_search' },
	})
}
