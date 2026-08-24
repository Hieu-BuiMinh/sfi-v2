'use client'

import React from 'react'
import Link from 'next/link'
import { GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { adminFinanceTransactionService } from '@/services/admin/finance/transactions'
import { TTransaction } from '@/services/admin/finance/transactions/transactions-res.dto'
import dayjs from 'dayjs'
import { formatMoney, TCurrency } from '@/utils/money'
import { useTranslations } from 'next-intl'
import { useTableParams } from '@/hooks/use-table-params'
import SfiTransactionStatusChip from '@/components/chips/transaction-status-chip'
import AdminTransactionFilter from '@/views/portal_sfi/admin/pages/transactions.page/components/transaction-filter'
import { SfiTable } from '@/components/table'
import { DEFAULT_PAGINATION } from '@/constants/components/pagination/pagination.const'

function AdminDepositGridView() {
	const t = useTranslations('admin.transactions.list')
	const [params, setParams] = useTableParams()

	const { data: response, isLoading } = useQuery({
		queryKey: adminFinanceTransactionService.getDepositTransactions.key({
			page: params.page,
			per_page: params.per_page,
			transaction_id: params.search || undefined,
			status: params.status || undefined,
			start_date: params.from ? dayjs(params.from).unix() : undefined,
			end_date: params.to ? dayjs(params.to).unix() : undefined,
		}),
		queryFn: () =>
			adminFinanceTransactionService.getDepositTransactions.get({
				page: params.page,
				per_page: params.per_page,
				transaction_id: params.search || undefined,
				status: params.status || undefined,
				start_date: params.from ? dayjs(params.from).unix() : undefined,
				end_date: params.to ? dayjs(params.to).unix() : undefined,
			}),
	})

	const transactions = response?.data?.data || []
	const total = response?.data?.total || 0

	const columns: GridColDef<TTransaction>[] = [
		{
			field: 'no',
			headerName: t('table.columns.no'),
			width: 70,
			renderCell: (params) => {
				const page = params.api.state.pagination.paginationModel.page ?? 0
				const pageSize = params.api.state.pagination.paginationModel.pageSize ?? 10
				const index = params.api.getRowIndexRelativeToVisibleRows(params.id)
				return page * pageSize + index + 1
			},
		},
		{
			field: 'id',
			headerName: t('table.columns.tran_id'),
			width: 150,
			renderCell: (params) => (
				<Link
					href={`/transactions/deposit/${params.value}`}
					className="text-mui-text-primary font-medium underline hover:underline"
				>
					{params.value}
				</Link>
			),
		},
		{
			field: 'created_at',
			headerName: t('table.columns.date_time'),
			width: 180,
			valueFormatter: (value) => (value ? dayjs(value * 1000).format('DD/MM/YYYY HH:mm') : '-'),
		},
		{
			field: 'status',
			headerName: t('table.columns.status'),
			width: 130,
			renderCell: (params) => <SfiTransactionStatusChip status={params.value} />,
		},
		{
			field: 'request',
			headerName: t('table.columns.request'),
			width: 200,
			valueGetter: (_, row) => row.user?.name || row.user?.email || '-',
		},
		{
			field: 'processed_by',
			headerName: t('table.columns.process_by'),
			width: 180,
			valueGetter: (_, row) => row?.sfi_deposit_approval?.user_approve?.name || '-',
		},
		{
			field: 'trading_account_id',
			headerName: t('table.columns.trading_account'),
			width: 150,
		},
		{
			field: 'beneficiary_bank',
			headerName: t('table.columns.beneficiary_bank'),
			width: 200,
			valueGetter: (_, row) => row.beneficiary_bank?.beneficiary_bank_name || '-',
		},
		{
			field: 'amount',
			headerName: t('table.columns.deposit_amount'),
			width: 150,
			renderCell: (params) => (
				<span className="font-bold">
					{formatMoney(params.row.amount, {
						currency: params.row.currency as TCurrency,
						showCode: true,
					})}
				</span>
			),
		},
		{
			field: 'verified_amount',
			headerName: t('table.columns.verified_amount'),
			width: 180,
			renderCell: (params) => (
				<span className="text-mui-text-secondary">
					{formatMoney(params.value, {
						currency: 'USD',
						showCode: true,
						fallback: '-',
					})}
				</span>
			),
		},
	]

	return (
		<div className="flex flex-col gap-4">
			<AdminTransactionFilter params={params} setParams={setParams} />

			<SfiTable params={params} setParams={setParams} rowCount={total} loading={isLoading}>
				<SfiTable.Base<TTransaction>
					rows={transactions}
					columns={columns}
					getRowId={(row) => row.id}
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
		</div>
	)
}

export default AdminDepositGridView
