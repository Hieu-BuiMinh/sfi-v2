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

export function useOrderHistoryTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'order_history_page',
			per_page: 'order_history_per_page',
			search: 'order_history_search',
			from: 'order_history_from',
			to: 'order_history_to',
		},
	})
}
