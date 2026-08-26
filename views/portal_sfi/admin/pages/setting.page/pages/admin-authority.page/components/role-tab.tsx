'use client'

import React, { useMemo } from 'react'
import { SfiTable } from '@/components/table'
import { GridColDef } from '@mui/x-data-grid'
import { DEFAULT_ROWS_PER_PAGE_OPTIONS as PAGINATION_PAGE_SIZE_OPTIONS } from '@/constants/components/pagination/pagination.const'
import { useRolesTableParams } from '../hooks/use-roles-table-params'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminRolesService } from '@/services/admin/roles'
import Link from 'next/link'

const formatRoleName = (name: string) => {
	if (!name) return '-'
	return name
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ')
}

import { useTranslations } from 'next-intl'

function AdminRoleTab() {
	const t = useTranslations('admin.settings.authority')
	const [params, setParams] = useRolesTableParams()

	const { data: rolesResponse, isLoading } = useQuery({
		queryKey: adminRolesService.getRoles.key({
			page: params.page ?? 1,
			perPage: params.per_page ?? 10,
			search: params.search ?? undefined,
		}),
		queryFn: () =>
			adminRolesService.getRoles.get({
				page: params.page ?? 1,
				perPage: params.per_page ?? 10,
				search: params.search ?? undefined,
			}),
		placeholderData: keepPreviousData,
	})

	const roles = rolesResponse?.data?.data || []
	const total = rolesResponse?.data?.total || 0

	const columns: GridColDef[] = useMemo(
		() => [
			{
				field: 'no',
				headerName: t('table.columns.no'),
				width: 80,
				sortable: false,
				renderCell: (params) => {
					const index = params.api.getRowIndexRelativeToVisibleRows(params.id)
					const page = params.api.state.pagination.paginationModel.page
					const pageSize = params.api.state.pagination.paginationModel.pageSize
					return page * pageSize + index + 1
				},
			},
			{
				field: 'name',
				headerName: t('table.columns.role'),
				flex: 1,
				minWidth: 200,
				renderCell: (params) => (
					<Link
						href={`/settings/authority/role/${params.row.name}`}
						className="text-mui-primary cursor-pointer font-semibold underline"
					>
						{formatRoleName(params.row.name)}
					</Link>
				),
			},
		],
		[t]
	)

	return (
		<div className="flex flex-col gap-4">
			<SfiTable
				params={{ ...params, per_page: params.per_page }}
				setParams={setParams}
				rowCount={total}
				loading={isLoading}
			>
				<SfiTable.Base
					rows={roles}
					columns={columns}
					hidePagination
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					getRowId={(row: any) => row.name}
					sx={{
						height: 700,
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
		</div>
	)
}

export default AdminRoleTab
