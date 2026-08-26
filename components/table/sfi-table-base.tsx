'use client'

import React, { useMemo, useCallback } from 'react'
import { DataGrid, GridSortModel, GridPaginationModel, GridValidRowModel } from '@mui/x-data-grid'
import { SfiTableBaseProps } from './sfi-table-base.types'
import { useSfiTableContext } from './sfi-table.context'

export const SfiTableBase = <T extends GridValidRowModel>(props: SfiTableBaseProps<T>) => {
	const context = useSfiTableContext()

	const params = props.params || context?.params
	const setParams = props.setParams || context?.setParams
	const hidePagination = props.hidePagination || props.hideFooterPagination

	if (!params || !setParams) {
		throw new Error(
			'SfiTableBase requires "params" and "setParams". Provide them as props or wrap with SfiTableProvider.'
		)
	}

	// Strip the provider-only props before forwarding the rest to DataGrid.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { params: _p, setParams: _s, hidePagination: _h, hideFooterPagination: _hf, ...dataGridProps } = props

	const paginationModel = useMemo(
		(): GridPaginationModel => ({
			page: (params.page || 1) - 1,
			pageSize: params.per_page || 10,
		}),
		[params.page, params.per_page]
	)

	const handlePaginationModelChange = useCallback(
		(model: GridPaginationModel) => {
			setParams({
				page: model.page + 1,
				per_page: model.pageSize,
			})
		},
		[setParams]
	)

	const sortModel = useMemo((): GridSortModel => {
		if (!params.sort_by) return []
		return [
			{
				field: params.sort_by,
				sort: params.sort_order || 'asc',
			},
		]
	}, [params.sort_by, params.sort_order])

	const handleSortModelChange = useCallback(
		(model: GridSortModel) => {
			if (model.length === 0) {
				setParams({
					sort_by: null,
					sort_order: null,
				})
			} else {
				setParams({
					sort_by: model[0].field,
					sort_order: model[0].sort as 'asc' | 'desc',
				})
			}
		},
		[setParams]
	)

	return (
		<div className="flex w-full overflow-hidden">
			<DataGrid<T>
				paginationMode="server"
				rowCount={props.rowCount ?? context?.rowCount}
				sortingMode="server"
				paginationModel={paginationModel}
				onPaginationModelChange={handlePaginationModelChange}
				sortModel={sortModel}
				onSortModelChange={handleSortModelChange}
				disableRowSelectionOnClick
				hideFooterPagination={hidePagination}
				hideFooter={hidePagination}
				loading={props.loading ?? context?.loading}
				{...dataGridProps}
				sx={{
					height: 500,
					width: 100,
					'& .MuiDataGrid-main': {
						overflow: 'auto',
					},
					...dataGridProps.sx,
				}}
				slotProps={{
					loadingOverlay: {
						variant: 'skeleton',
						noRowsVariant: 'skeleton',
						...dataGridProps.slotProps?.loadingOverlay,
					},
					...dataGridProps.slotProps,
				}}
			/>
		</div>
	)
}

export default SfiTableBase
