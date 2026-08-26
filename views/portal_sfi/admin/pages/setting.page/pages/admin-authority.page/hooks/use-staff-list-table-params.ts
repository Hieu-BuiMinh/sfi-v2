'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(10),
	search: parseAsString,
	department: parseAsString,
	location: parseAsString,
}

export function useStaffListTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'staff_page',
			per_page: 'staff_per_page',
			search: 'staff_search',
			department: 'staff_department',
			location: 'staff_location',
		},
	})
}

export function resetStaffListTableParams(setParams: ReturnType<typeof useStaffListTableParams>[1]) {
	setParams({ page: null, per_page: null, search: null, department: null, location: null })
}
