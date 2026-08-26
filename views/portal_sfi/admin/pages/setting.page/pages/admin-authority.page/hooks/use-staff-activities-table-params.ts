'use client'

import { DEFAULT_PAGE } from '@/constants/components/pagination/pagination.const'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const parsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	per_page: parseAsInteger.withDefault(10),
	search: parseAsString,
	from: parseAsString,
	to: parseAsString,
	event: parseAsString,
}

export function useStaffActivitiesTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'staff_activities_page',
			per_page: 'staff_activities_per_page',
			search: 'staff_activities_search',
			from: 'staff_activities_from',
			to: 'staff_activities_to',
			event: 'staff_activities_event',
		},
	})
}

export function resetStaffActivitiesTableParams(setParams: ReturnType<typeof useStaffActivitiesTableParams>[1]) {
	setParams({ page: null, per_page: null, search: null, from: null, to: null, event: null })
}
