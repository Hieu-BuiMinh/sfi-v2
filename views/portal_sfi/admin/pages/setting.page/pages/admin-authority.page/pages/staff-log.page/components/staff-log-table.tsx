'use client'

import React, { useMemo } from 'react'
import { SfiTable } from '@/components/table'
import { DEFAULT_ROWS_PER_PAGE_OPTIONS as PAGINATION_PAGE_SIZE_OPTIONS } from '@/constants/components/pagination/pagination.const'

interface StaffLogTableProps {
	data: TStaffActivityItem[]
	total: number
	loading?: boolean
	params: ReturnType<typeof useStaffActivitiesTableParams>[0]
	setParams: ReturnType<typeof useStaffActivitiesTableParams>[1]
}

import { useTranslations } from 'next-intl'
import { TStaffActivityItem } from '@/services/admin/staffs/staffs-res.dto'
import { useStaffActivitiesTableParams } from '@/views/portal_sfi/admin/pages/setting.page/pages/admin-authority.page/hooks/use-staff-activities-table-params'
import { getStaffLogColumns } from '@/views/portal_sfi/admin/pages/setting.page/pages/admin-authority.page/pages/staff-log.page/components/staff-log.columns'

export function StaffLogTable({ data, total, loading, params, setParams }: StaffLogTableProps) {
	const t = useTranslations('admin.settings.authority')
	const columns = useMemo(() => getStaffLogColumns(t), [t])

	return (
		<SfiTable
			params={{ ...params, per_page: params.per_page }}
			setParams={setParams}
			rowCount={total}
			loading={loading}
		>
			<SfiTable.Base
				rows={data}
				columns={columns}
				getRowId={(row) => row.id}
				hidePagination
				getRowHeight={() => 'auto'}
				// getEstimatedRowHeight={() => 0}
				sx={{
					'& .MuiDataGrid-cell': {
						borderBottom: '1px solid var(--mui-palette-divider)',
						py: 2,
						alignItems: 'flex-start',
						overflow: 'hidden',
					},
					'& .MuiDataGrid-cell:not([data-field="old_values"]):not([data-field="new_values"])': {
						whiteSpace: 'nowrap',
						display: 'block',
						'& > *': {
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						},
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
				rowsPerPageOptions={PAGINATION_PAGE_SIZE_OPTIONS}
				showTotalCount
			/>
		</SfiTable>
	)
}

export default StaffLogTable
