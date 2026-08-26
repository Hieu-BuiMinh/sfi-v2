'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, useQueryStates } from 'nuqs'

const parsers = { page: parseAsInteger.withDefault(DEFAULT_PAGE), per_page: parseAsInteger.withDefault(10) }

export function useAccountListTableParams(type: 'live' | 'demo') {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: { page: `${type}_accounts_page`, per_page: `${type}_accounts_per_page` },
	})
}
