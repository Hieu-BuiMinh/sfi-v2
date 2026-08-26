'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(10),
	search: parseAsString,
	from: parseAsString,
	to: parseAsString,
}

export function useAdminCustomersTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'customers_page',
			per_page: 'customers_per_page',
			search: 'customers_search',
			from: 'customers_from',
			to: 'customers_to',
		},
	})
}
