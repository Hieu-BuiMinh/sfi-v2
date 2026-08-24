import { DataGridProps, GridValidRowModel } from '@mui/x-data-grid'
import { TableParams } from '@/hooks/use-table-params'

export interface SfiTableBaseProps<T extends GridValidRowModel> extends Omit<
	DataGridProps<T>,
	'paginationModel' | 'onPaginationModelChange' | 'sortModel' | 'onSortModelChange'
> {
	/**
	 * Params from useTableParams hook (Optional if used within SfiTableProvider)
	 */
	params?: TableParams

	/**
	 * setter from useTableParams hook (Optional if used within SfiTableProvider)
	 */
	setParams?: (
		values: Partial<TableParams> | ((old: TableParams) => Partial<TableParams>),
		options?:
			| {
					history?: 'replace' | 'push' | undefined
					scroll?: boolean | undefined
					shallow?: boolean | undefined
			  }
			| undefined
	) => Promise<URLSearchParams>

	/**
	 * Hide the pagination footer in DataGrid
	 */
	hidePagination?: boolean

	/**
	 * Alias for hidePagination to match DataGrid naming if preferred
	 */
	hideFooterPagination?: boolean
}
