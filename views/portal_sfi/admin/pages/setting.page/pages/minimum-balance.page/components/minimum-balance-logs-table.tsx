'use client'

import { DEFAULT_ROWS_PER_PAGE_OPTIONS } from '@/constants/components/pagination/pagination.const'
import { SfiTable } from '@/components/table'
import { TAdminSettingLogItem } from '@/services/admin/staffs/admin-setting/admin-setting-res.dto'
import { formatDate } from '@/utils/dayjs'
import { formatNumber } from '@/utils/money'
import { GridColDef } from '@mui/x-data-grid'
import { useMemo } from 'react'
import { useMinimumBalanceLogsTableParams } from '../hooks/use-minimum-balance-logs-table-params'

interface MinimumBalanceLogsTableProps {
	params: ReturnType<typeof useMinimumBalanceLogsTableParams>[0]
	setParams: ReturnType<typeof useMinimumBalanceLogsTableParams>[1]
	rows: TAdminSettingLogItem[]
	total: number
	loading: boolean
}

function MinimumBalanceLogsTable({ params, setParams, rows, total, loading }: MinimumBalanceLogsTableProps) {
	const columns = useMemo<GridColDef<TAdminSettingLogItem>[]>(
		() => [
			{
				field: 'modified_at',
				headerName: 'Timestamp',
				width: 180,
				sortable: false,
				valueFormatter: (value: number) => formatDate(value * 1000, 'YYYY-MM-DD HH:mm:ss'),
			},
			{
				field: 'username',
				headerName: 'Username',
				width: 180,
				sortable: false,
				valueGetter: (_, row) =>
					[row.admin.first_name, row.admin.last_name].filter(Boolean).join(' ') || row.admin.name,
			},
			{
				field: 'role',
				headerName: 'Role',
				flex: 1,
				minWidth: 300,
				sortable: false,
				valueGetter: (_, row) =>
					row.admin.roles
						.map((role) =>
							role.name
								.split('_')
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(' ')
						)
						.join(', '),
			},
			{
				field: 'old_value',
				headerName: 'Old Minimum Balance',
				width: 210,
				sortable: false,
				renderCell: ({ row }) =>
					`${formatNumber(row.old_value, { digits: 0 })} ${row.key.split('_')[0].toUpperCase()}`,
			},
			{
				field: 'new_value',
				headerName: 'New Minimum Balance',
				width: 210,
				sortable: false,
				renderCell: ({ row }) =>
					`${formatNumber(row.new_value, { digits: 0 })} ${row.key.split('_')[0].toUpperCase()}`,
			},
		],
		[]
	)

	return (
		<SfiTable params={params} setParams={setParams} rowCount={total} loading={loading}>
			<SfiTable.Base<TAdminSettingLogItem>
				rows={rows}
				columns={columns}
				getRowId={(row) => row.id}
				hidePagination
				disableColumnMenu
				getRowHeight={() => 'auto'}
				sx={{
					minHeight: 500,
					'& .MuiDataGrid-cell': {
						borderBottom: '1px solid var(--mui-palette-divider)',
						py: 2,
					},
					'& .MuiDataGrid-columnHeaders': {
						bgcolor: 'var(--mui-palette-background-default)',
						borderBottom: '2px solid var(--mui-palette-divider)',
					},
				}}
			/>
			<SfiTable.Pagination
				color="primary"
				variant="outlined"
				shape="rounded"
				rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
				showTotalCount
			/>
		</SfiTable>
	)
}

export default MinimumBalanceLogsTable
