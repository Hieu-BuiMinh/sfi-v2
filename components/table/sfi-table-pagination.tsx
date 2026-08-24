'use client'

import {
	MenuItem,
	Pagination,
	PaginationProps,
	Select,
	SelectChangeEvent,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import React from 'react'
import { useSfiTableContext } from './sfi-table.context'

export interface SfiTablePaginationProps extends Omit<PaginationProps, 'page' | 'count' | 'onChange'> {
	page?: number
	count?: number
	onChange?: (event: React.ChangeEvent<unknown>, page: number) => void
	showRowsPerPage?: boolean
	showTotalCount?: boolean
	rowsPerPageOptions?: number[]
}

export const SfiTablePagination = (props: SfiTablePaginationProps) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
	const isDesktop = !isMobile && !isTablet
	const context = useSfiTableContext()
	const {
		page: propPage,
		count: propCount,
		onChange: propOnChange,
		showRowsPerPage = true,
		showTotalCount = true,
		rowsPerPageOptions = [10, 20, 50, 100],
		...paginationProps
	} = props

	const params = context?.params
	const setParams = context?.setParams
	const rowCount = context?.rowCount || 0

	const pageSize = params?.per_page || 10
	const totalPages = propCount !== undefined ? propCount : Math.ceil(rowCount / pageSize)
	const currentPage = propPage !== undefined ? propPage : params?.page || 1

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		if (propOnChange) {
			propOnChange(event, value)
		} else if (setParams) {
			setParams({ page: value })
		}
	}

	const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
		const newSize = Number(event.target.value)
		if (setParams) {
			setParams({ per_page: newSize, page: 1 })
		}
	}

	const siblingCount = isMobile ? 0 : isTablet ? 1 : 2
	const boundaryCount = isMobile ? 0 : 1

	if (totalPages <= 0 && propCount === undefined) return null

	return (
		<div className="flex items-center justify-between">
			{showTotalCount && isDesktop && (
				<span className="text-sm font-medium text-gray-600">Total {rowCount} Records</span>
			)}
			<div className="flex flex-wrap items-center gap-4 max-sm:flex-1 max-sm:justify-between">
				{showRowsPerPage && (
					<div className="flex items-center gap-2">
						<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
							Rows per page:
						</Typography>
						<Select
							value={pageSize}
							onChange={handleRowsPerPageChange}
							variant="standard"
							size="small"
							sx={{
								fontSize: '0.75rem',
								fontWeight: 600,
								'&:before, &:after': { display: 'none' },
								'& .MuiSelect-select': { py: 0.5 },
							}}
						>
							{rowsPerPageOptions.map((option) => (
								<MenuItem key={option} value={option} sx={{ fontSize: '0.75rem' }}>
									{option}
								</MenuItem>
							))}
						</Select>
					</div>
				)}

				<Pagination
					color="primary"
					shape="rounded"
					size="medium"
					count={totalPages}
					page={currentPage}
					onChange={handlePageChange}
					siblingCount={siblingCount}
					boundaryCount={boundaryCount}
					{...paginationProps}
				/>
			</div>
		</div>
	)
}

export default SfiTablePagination
