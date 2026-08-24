'use client'

import SfiApplicationChip from '@/components/chips/application-chip'
import SfiDateRangePicker from '@/components/inputs/sfi-date-range-picker'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import { SfiTable } from '@/components/table'
import SfiPageTitle from '@/components/wording/page-title'
import { DEFAULT_PAGINATION } from '@/constants/components/pagination/pagination.const'
import { APPLICATION_STATUS } from '@/dto/enums/application'
import { useTableParams } from '@/hooks/use-table-params'
import { adminCustomerService } from '@/services/admin/users/customers'
import { TCustomerApplicationListItem } from '@/services/admin/users/customers/customer-res.dto'
import ReplayIcon from '@mui/icons-material/Replay'
import { Button, InputAdornment } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

function AdminCustomersPageView() {
	const t = useTranslations('admin.customers.list')
	const [params, setParams] = useTableParams()

	const { data: response, isLoading } = useQuery({
		queryKey: adminCustomerService.getCustomers.key({
			page: params.page,
			perPage: params.per_page,
			search: params.search ?? undefined,
			from_date: params.from ? dayjs(params.from).format('YYYY-MM-DD') : undefined,
			to_date: params.to ? `${dayjs(params.to).format('YYYY-MM-DD')} 23:59:59` : undefined,
		}),
		queryFn: () =>
			adminCustomerService.getCustomers.get({
				page: params.page,
				perPage: params.per_page,
				search: params.search ?? undefined,
				from_date: params.from ? dayjs(params.from).format('YYYY-MM-DD') : undefined,
				to_date: params.to ? `${dayjs(params.to).format('YYYY-MM-DD')} 23:59:59` : undefined,
			}),
	})

	const customers = response?.data?.data || []
	const total = response?.data?.total || 0

	const handleReset = () => {
		setParams({
			search: null,
			from: null,
			to: null,
			page: 1,
			per_page: 10,
		})
	}

	const columns: GridColDef<TCustomerApplicationListItem>[] = [
		{
			field: 'no',
			headerName: t('table.columns.no'),
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
			field: 'email',
			headerName: t('table.columns.email'),
			width: 250,
			renderCell: (params) => (
				<Link
					className="text-mui-primary-main font-medium underline"
					href={`/customers/${params.row.user?.id}?applicationId=${params.row.id}`}
				>
					{params.row.user?.email || '-'}
				</Link>
			),
		},
		{
			field: 'type',
			headerName: t('table.columns.type'),
			width: 150,
			valueGetter: (_, row) => row.application_type?.name || '-',
		},
		{
			field: 'name',
			headerName: t('table.columns.name'),
			width: 200,
			valueGetter: (_, row) => row.user?.name || '-',
		},
		{
			field: 'nationality',
			headerName: t('table.columns.nationality'),
			width: 150,
			valueGetter: (_, row) => row.content?.nationality || '-',
		},
		{
			field: 'status',
			headerName: t('table.columns.status'),
			width: 180,
			renderCell: (params) => {
				const status = params.value as APPLICATION_STATUS
				return <SfiApplicationChip status={status} />
			},
		},
		{
			field: 'created_at',
			headerName: t('table.columns.create_time'),
			flex: 1,
			minWidth: 180,
			valueFormatter: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'),
		},
	]

	return (
		<div className="flex w-full flex-col gap-5">
			<BreadcrumbSfi
				items={[{ label: t('breadcrumb.admin'), href: '/dashboard' }, { label: t('breadcrumb.customer_list') }]}
			/>

			<SfiPageTitle title={t('title', { total })} subtitle={t('subtitle')} />

			{/* Unified Filter Bar */}
			<div className="flex flex-wrap items-end gap-4">
				<div className="w-full sm:max-w-xs">
					<SfiDebounceTextField
						placeholder={t('filter.search.placeholder')}
						label={t('filter.search.label')}
						size="medium"
						value={params.search || ''}
						onDebounce={(val) => setParams({ search: val ? (val as string) : null, page: 1 })}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position="end">
										<SearchIcon fontSize="small" className="text-mui-text-secondary" />
									</InputAdornment>
								),
							},
						}}
					/>
				</div>
				<div className="flex flex-wrap items-end gap-3">
					<div className="w-full sm:w-70">
						<SfiDateRangePicker
							size="medium"
							label={t('filter.date_range.label')}
							placeholder={t('filter.date_range.placeholder')}
							value={{ from: params.from, to: params.to }}
							onChange={(range) => setParams({ from: range.from, to: range.to, page: 1 })}
							showPresets
						/>
					</div>
					<Button
						variant="outlined"
						size="medium"
						startIcon={<ReplayIcon className="size-4" />}
						onClick={handleReset}
						className="border-mui-divider text-mui-text-primary hover:bg-mui-primary-alpha/5 rounded-lg px-4 font-medium lowercase"
					>
						{t('filter.reset')}
					</Button>
				</div>
			</div>

			<SfiTable
				params={{ ...params, per_page: params.per_page }}
				setParams={setParams}
				rowCount={total}
				loading={isLoading}
			>
				<SfiTable.Base
					rows={customers}
					columns={columns}
					getRowId={(row) => row.id}
					hidePagination
					autoHeight
					sx={{
						'& .MuiDataGrid-cell': {
							borderBottom: '1px solid var(--mui-palette-divider)',
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
					rowsPerPageOptions={DEFAULT_PAGINATION.ROWS_PER_PAGE_OPTIONS}
					showTotalCount
				/>
			</SfiTable>
		</div>
	)
}

export default AdminCustomersPageView
