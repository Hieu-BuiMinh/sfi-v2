import { DataGridProps, GridValidRowModel } from '@mui/x-data-grid'
import { SfiTableParams, SfiTableParamsSetter } from './sfi-table.context'

export interface SfiTableBaseProps<T extends GridValidRowModel> extends Omit<
	DataGridProps<T>,
	'paginationModel' | 'onPaginationModelChange' | 'sortModel' | 'onSortModelChange'
> {
	/**
	 * Params from the API-specific table params hook (optional inside SfiTableProvider).
	 */
	params?: SfiTableParams

	/**
	 * Setter from the API-specific table params hook (optional inside SfiTableProvider).
	 */
	setParams?: SfiTableParamsSetter

	/**
	 * Hide the pagination footer in DataGrid
	 */
	hidePagination?: boolean

	/**
	 * Alias for hidePagination to match DataGrid naming if preferred
	 */
	hideFooterPagination?: boolean
}
