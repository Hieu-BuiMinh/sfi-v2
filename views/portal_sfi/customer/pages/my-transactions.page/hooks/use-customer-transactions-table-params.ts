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

export function useCustomerTransactionsTableParams(type: 'deposit' | 'withdraw') {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: `${type}_page`,
			per_page: `${type}_per_page`,
			search: `${type}_search`,
			status: `${type}_status`,
			from: `${type}_from`,
			to: `${type}_to`,
		},
	})
}
