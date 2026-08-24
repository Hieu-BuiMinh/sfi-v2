'use client'

import { SfiTableBase } from './sfi-table-base'
import { SfiTablePagination } from './sfi-table-pagination'
import { SfiTableProvider } from './sfi-table.context'

export const SfiTable = Object.assign(SfiTableProvider, {
	Base: SfiTableBase,
	Pagination: SfiTablePagination,
})

export * from './sfi-table-base'
export * from './sfi-table-pagination'
export * from './sfi-table.context'
export * from './sfi-table-base.types'
