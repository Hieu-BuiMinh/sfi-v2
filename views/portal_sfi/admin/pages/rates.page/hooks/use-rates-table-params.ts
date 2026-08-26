'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, useQueryStates } from 'nuqs'

const parsers = { page: parseAsInteger.withDefault(DEFAULT_PAGE), per_page: parseAsInteger.withDefault(10) }

export function useRatesTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: { page: 'rates_page', per_page: 'rates_per_page' },
	})
}
