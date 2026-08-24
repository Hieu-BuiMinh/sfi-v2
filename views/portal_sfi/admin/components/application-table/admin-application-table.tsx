/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { TApplication } from '@/services/admin/applications/applications-res.dto'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, IconButton, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

import SfiApplicationChip from '@/components/chips/application-chip'
import { SfiTable } from '@/components/table'
import { DEFAULT_PAGINATION } from '@/constants/components/pagination/pagination.const'
import { APPLICATION_STATUS } from '@/dto/enums/application'
import { TableParams, useTableParams } from '@/hooks/use-table-params'
import { adminApplicationService } from '@/services/admin/applications'
import { useQuery } from '@tanstack/react-query'

interface AdminApplicationTableProps {
	params: TableParams
	setParams: ReturnType<typeof useTableParams>[1]
	pageSizeOptions?: number[]
}

const AdminApplicationTable = ({
	params,
	setParams,
	pageSizeOptions = DEFAULT_PAGINATION.ROWS_PER_PAGE_OPTIONS,
}: AdminApplicationTableProps) => {
	const t = useTranslations('admin.applications.table')
	const locale = useLocale()
	const { data: response, isLoading } = useQuery({
		queryKey: adminApplicationService.getApplications.key({
			page: params.page,
			perPage: params.per_page,
			search: params.search,
			status: params.status === 'all' ? null : params.status,
			created_from: params.from ? dayjs(params.from).format('YYYY-MM-DD') : undefined,
			created_to: params.to ? `${dayjs(params.to).format('YYYY-MM-DD')} 23:59:59` : undefined,
		}),
		queryFn: () =>
			adminApplicationService.getApplications.get({
				page: params.page,
				perPage: params.per_page,
				search: params.search,
				status: params.status,
				created_from: params.from ? dayjs(params.from).format('YYYY-MM-DD') : undefined,
				created_to: params.to ? `${dayjs(params.to).format('YYYY-MM-DD')} 23:59:59` : undefined,
			}),
	})

	const applications = response?.data?.data || []
	const total = response?.data?.total || 0

	const columns: GridColDef<TApplication>[] = [
		{
			field: 'no',
			headerName: t('columns.no'),
			width: 70,
			sortable: false,
			renderCell: (params) => {
				const page = params.api.state.pagination.paginationModel.page ?? 0
				const pageSize = params.api.state.pagination.paginationModel.pageSize ?? 10
				const index = params.api.getRowIndexRelativeToVisibleRows(params.id)
				return page * pageSize + index + 1
			},
		},
		{
			field: 'id',
			headerName: t('columns.id'),
			width: 150,
			renderCell: (params) => (
				<Link className="text-mui-primary-main font-medium underline" href={`/applications/${params.row.id}`}>
					{params.value}
				</Link>
			),
		},
		{
			field: 'status',
			headerName: t('columns.status'),
			width: 150,
			renderCell: (params) => {
				const status = params.value as APPLICATION_STATUS
				return <SfiApplicationChip status={status} />
			},
		},
		{
			field: 'customer_name',
			headerName: t('columns.customer_name'),
			width: 200,
			valueGetter: (_, row) =>
				row.user?.name || (row.user?.first_name ? `${row.user.first_name} ${row.user.last_name}` : '-'),
		},
		{
			field: 'email',
			headerName: t('columns.email'),
			width: 200,
			valueGetter: (_, row) => row.user?.email || '-',
		},
		{
			field: 'type',
			headerName: t('columns.type'),
			width: 150,
			valueGetter: (_, row) => row.application_type?.name || '-',
		},
		{
			field: 'products',
			headerName: t('columns.product'),
			flex: 1,
			minWidth: 200,
			valueGetter: (_, row) => row.application_products?.map((p) => p.name).join(', ') || '-',
		},
		{
			field: 'created_at',
			headerName: t('columns.create_time'),
			width: 180,
			valueFormatter: (value) => (value ? dayjs(value).locale(locale).format('DD/MM/YYYY HH:mm') : '-'),
		},
		{
			field: 'approved_at',
			headerName: t('columns.approved_time'),
			width: 180,
			valueGetter: (_, row) => {
				if (
					row.status === APPLICATION_STATUS.STATUS_APPROVE ||
					row.status === APPLICATION_STATUS.STATUS_REJECT
				) {
					return row.approved_at || row.updated_at
				}
				return null
			},
			valueFormatter: (value) => (value ? dayjs(value).locale(locale).format('DD/MM/YYYY HH:mm') : '-'),
		},
		{
			field: 'actions',
			headerName: t('columns.actions'),
			width: 100,
			sortable: false,
			align: 'right',
			headerAlign: 'right',
			renderCell: (params) => (
				<Box>
					<Tooltip title={t('actions.view')}>
						<Link href={`/applications/${params.row.id}`}>
							<IconButton size="small">
								<VisibilityIcon fontSize="small" />
							</IconButton>
						</Link>
					</Tooltip>
				</Box>
			),
		},
	]

	return (
		<SfiTable
			params={{ ...params, per_page: params.per_page }}
			setParams={setParams}
			rowCount={total}
			loading={isLoading}
		>
			<SfiTable.Base rows={applications} columns={columns} getRowId={(row) => row.id} hidePagination />

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

export default AdminApplicationTable
