'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(10),
	type: parseAsString,
	search: parseAsString,
	from: parseAsString,
	to: parseAsString,
}

export function useMt5HistoryTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'mt5_history_page',
			per_page: 'mt5_history_per_page',
			type: 'mt5_history_type',
			search: 'mt5_history_search',
			from: 'mt5_history_from',
			to: 'mt5_history_to',
		},
	})
}
