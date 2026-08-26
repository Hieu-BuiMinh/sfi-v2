'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(10),
}

export function useCustomerApplicationsTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: { page: 'my_applications_page', per_page: 'my_applications_per_page' },
	})
}
