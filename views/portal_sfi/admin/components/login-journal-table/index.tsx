'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminAuth0Service } from '@/services/admin/auth0'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { TableParams, useTableParams } from '@/hooks/use-table-params'
import { SfiTable } from '@/components/table'
import { DEFAULT_PAGINATION } from '@/constants/components/pagination/pagination.const'

interface LoginJournalTableProps {
	auth0Id: string | undefined
	params: TableParams
	setParams: ReturnType<typeof useTableParams>[1]
}

export const LoginJournalTable = ({ auth0Id, params, setParams }: LoginJournalTableProps) => {
	const { data, isLoading } = useQuery({
		queryKey: adminAuth0Service.getLogs.key({
			id: auth0Id || '',
			params: {
				page: params.page || 1,
				per_page: params.per_page || 10,
			},
		}),
		queryFn: () =>
			adminAuth0Service.getLogs.get({
				id: auth0Id || '',
				params: {
					page: params.page || 1,
					per_page: params.per_page || 10,
				},
			}),
		enabled: !!auth0Id,
	})

	const logs = data?.data?.data || []
	const total = data?.data?.total || 0

	const columns: GridColDef[] = [
		{
			field: 'no',
			headerName: 'No.',
			width: 70,
			sortable: false,
			renderCell: (params: GridRenderCellParams) => {
				const page = params.api.state.pagination.paginationModel.page ?? 0
				const pageSize = params.api.state.pagination.paginationModel.pageSize ?? 10
				const index = params.api.getRowIndexRelativeToVisibleRows(params.id)
				return page * pageSize + index + 1
			},
		},
		{
			field: 'date',
			headerName: 'Date',
			flex: 1,
			minWidth: 180,
			renderCell: (params: GridRenderCellParams) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
		},
		{
			field: 'type',
			headerName: 'Type',
			width: 150,
			renderCell: (params: GridRenderCellParams) => <div className="font-medium">{params.value}</div>,
		},
		{
			field: 'user_id',
			headerName: 'User ID',
			flex: 1,
			minWidth: 200,
		},
		{
			field: 'ip',
			headerName: 'IP Address',
			width: 130,
		},
	]

	if (!auth0Id && !isLoading) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Typography color="textSecondary">No login logs found for this user.</Typography>
			</Box>
		)
	}

	return (
		<SfiTable
			params={{ ...params, per_page: params.per_page || 10 }}
			setParams={setParams}
			rowCount={total}
			loading={isLoading}
		>
			<SfiTable.Base
				rows={logs}
				columns={columns}
				getRowId={(row) => `${row.date}-${row.ip}-${row.type}`}
				hidePagination
			/>

			<SfiTable.Pagination
				color="primary"
				variant="outlined"
				shape="rounded"
				rowsPerPageOptions={DEFAULT_PAGINATION.ROWS_PER_PAGE_OPTIONS}
				showTotalCount
			/>
		</SfiTable>
	)
}
