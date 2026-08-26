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

export function useAdminTransactionTableParams(type: 'deposit' | 'withdrawal') {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: `${type}_transactions_page`,
			per_page: `${type}_transactions_per_page`,
			search: `${type}_transactions_search`,
			status: `${type}_transactions_status`,
			from: `${type}_transactions_from`,
			to: `${type}_transactions_to`,
		},
	})
}
