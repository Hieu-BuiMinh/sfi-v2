'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(10),
	search: parseAsString,
	status: parseAsString,
	from: parseAsString,
	to: parseAsString,
}

export function useAdminApplicationsTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'applications_page',
			per_page: 'applications_per_page',
			search: 'applications_search',
			status: 'applications_status',
			from: 'applications_from',
			to: 'applications_to',
		},
	})
}
