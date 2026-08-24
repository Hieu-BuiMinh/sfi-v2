'use client'

import { createParser, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

export type TableParams = {
	page?: number | null
	per_page?: number | null
	search?: string | null
	status?: string | null
	type?: string | null
	from?: string | null
	to?: string | null
	sort_by?: string | null
	sort_order?: 'asc' | 'desc' | null
	filter_by?: string | null
	department?: string | null
	location?: string | null
	event?: string | null
}

const parsers = {
	// Pagination - with defaults
	page: parseAsInteger.withDefault(1),
	per_page: parseAsInteger.withDefault(10),

	// Search - no default
	search: parseAsString,

	// Filters - no defaults
	status: parseAsString,
	type: parseAsString,
	filter_by: parseAsString,
	department: parseAsString,
	location: parseAsString,
	event: parseAsString,

	// Date range - no defaults
	from: parseAsString,
	to: parseAsString,

	// Sorting - no defaults
	sort_by: parseAsString,
	sort_order: createParser({
		parse: (value) => {
			if (value === 'asc' || value === 'desc') return value
			return null
		},
		serialize: (value) => value || '',
	}),
}

export function useTableParams() {
	return useQueryStates(parsers, {
		history: 'push',
		shallow: false,
	})
}

export function resetTableParams(setParams: ReturnType<typeof useTableParams>[1]) {
	setParams({
		page: null,
		per_page: null,
		search: null,
		status: null,
		type: null,
		from: null,
		to: null,
		sort_by: null,
		sort_order: null,
		filter_by: null,
		department: null,
		location: null,
		event: null,
	})
}

export function getDefaultTableParams(): Required<TableParams> {
	return {
		page: 1,
		per_page: 10,
		search: null,
		status: null,
		type: null,
		from: null,
		to: null,
		sort_by: null,
		sort_order: null,
		filter_by: null,
		department: null,
		location: null,
		event: null,
	}
}

/**
 * Example 1: Basic table with pagination + search
 *
 * function MyTable() {
 *   const [params, setParams] = useTableParams()
 *
 *   // Values now have defaults from parsers
 *   const page = params.page // defaults to 1
 *   const perPage = params.per_page // defaults to 10
 *   const search = params.search ?? ''
 *
 *   return (
 *     <div>
 *       <input
 *         value={search}
 *         onChange={(e) => setParams({ search: e.target.value || null })}
 *       />
 *       <button onClick={() => setParams({ page: (page + 1) })}>
 *         Next Page
 *       </button>
 *     </div>
 *   )
 * }
 */

/**
 * Example 2: Table with filters
 *
 * function FilteredTable() {
 *   const [params, setParams] = useTableParams()
 *
 *   const status = params.status ?? ''
 *   const type = params.type ?? ''
 *
 *   return (
 *     <div>
 *       <select
 *         value={status}
 *         onChange={(e) => setParams({
 *           status: e.target.value || null,
 *           page: null // Reset to first page
 *         })}
 *       >
 *         <option value="">All Status</option>
 *         <option value="active">Active</option>
 *         <option value="inactive">Inactive</option>
 *       </select>
 *     </div>
 *   )
 * }
 */

/**
 * Example 3: Table with date range
 *
 * function DateRangeTable() {
 *   const [params, setParams] = useTableParams()
 *
 *   const from = params.from ?? ''
 *   const to = params.to ?? ''
 *
 *   return (
 *     <DateRangePicker
 *       from={from}
 *       to={to}
 *       onChange={(range) => setParams({
 *         from: range.from || null,
 *         to: range.to || null
 *       })}
 *     />
 *   )
 * }
 */

/**
 * Example 4: Reset all filters
 *
 * function TableWithReset() {
 *   const [params, setParams] = useTableParams()
 *
 *   return (
 *     <button onClick={() => resetTableParams(setParams)}>
 *       Reset All Filters
 *     </button>
 *   )
 * }
 */
