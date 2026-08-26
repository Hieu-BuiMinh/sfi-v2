'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(10),
	type: parseAsString,
	status: parseAsString,
	from: parseAsString,
	to: parseAsString,
}

export function useCustomerFundTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'fund_page',
			per_page: 'fund_per_page',
			type: 'fund_type',
			status: 'fund_status',
			from: 'fund_from',
			to: 'fund_to',
		},
	})
}
