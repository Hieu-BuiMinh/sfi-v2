'use client'

import React from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminFinanceTransactionService } from '@/services/admin/finance/transactions'
import { formatNumber } from '@/utils/money'
import dayjs from '@/utils/dayjs'
import { GridColDef } from '@mui/x-data-grid'
import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCustomerFundTableParams } from '../../hooks/use-customer-fund-table-params'
import { SfiOption } from '@/components/inputs/types'
import SfiTransactionStatusChip from '@/components/chips/transaction-status-chip'
import SfiDateRangePicker from '@/components/inputs/sfi-date-range-picker'
import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import ReplayIcon from '@mui/icons-material/Replay'
import { SfiTable } from '@/components/table'

interface FundTabProps {
	accountNo: string
}

const FundTab = ({ accountNo }: FundTabProps) => {
	const t = useTranslations('admin.customers.tabs.funds_content')
	const commonT = useTranslations('common.button_text')
	const [params, setParams] = useCustomerFundTableParams()

	const PAYMENT_TYPE_OPTIONS: SfiOption[] = [
		{ label: t('options.deposit'), value: 'deposit' },
		{ label: t('options.withdrawal'), value: 'withdrawal' },
	]

	const STATUS_OPTIONS: SfiOption[] = [
		{ label: t('options.all'), value: 'all' },
		{ label: t('options.pending'), value: '0' },
		{ label: t('options.approved'), value: '1' },
		{ label: t('options.processing'), value: '2' },
		{ label: t('options.rejected'), value: '3' },
	]

	const { data: transactionsData, isLoading } = useQuery({
		queryKey: adminFinanceTransactionService.getTransactionsList.key({
			accountLogin: accountNo,
			params: {
				page: params.page,
				per_page: params.per_page,
				payment_type: params.type || 'deposit',
				status: params.status || '',
				start_date: params.from ? dayjs(params.from).unix() : null,
				end_date: params.to ? dayjs(params.to).unix() : null,
			},
		}),
		queryFn: () =>
			adminFinanceTransactionService.getTransactionsList.get({
				accountLogin: accountNo,
				params: {
					page: params.page,
					per_page: params.per_page,
					payment_type: params.type || 'deposit',
					status: params.status || '',
					start_date: params.from ? dayjs(params.from).unix() : null,
					end_date: params.to ? dayjs(params.to).unix() : null,
				},
			}),
		placeholderData: keepPreviousData,
		enabled: !!accountNo,
	})

	const transactions = transactionsData?.data?.data || []
	const total = transactionsData?.data?.total || 0

	const columns: GridColDef[] = [
		{
			field: 'created_at',
			headerName: t('table.columns.time_created'),
			flex: 1,
			minWidth: 160,
			renderCell: (params) => dayjs(params.value * 1000).format('DD/MM/YYYY HH:mm'),
		},
		{
			field: 'id',
			headerName: t('table.columns.id_transaction'),
			flex: 1,
			minWidth: 180,
		},
		{
			field: 'trading_account_id',
			headerName: t('table.columns.account'),
			width: 120,
			renderCell: (params) => params.value,
		},
		{
			field: 'payment_type',
			headerName: t('table.columns.type'),
			width: 100,
			renderCell: (params) => {
				const type = params.value === 1 ? t('options.deposit') : t('options.withdrawal')
				return <span className="text-xs">{type}</span>
			},
		},
		{
			field: 'updated_at',
			headerName: t('table.columns.time_completed'),
			flex: 1,
			minWidth: 160,
			renderCell: (params) => dayjs(params.value * 1000).format('DD/MM/YYYY HH:mm'),
		},
		{
			field: 'amount',
			headerName: t('table.columns.amount'),
			width: 150,
			align: 'right',
			headerAlign: 'right',
			renderCell: (params) => (
				<span className="text-mui-text-primary text-xs font-semibold">{formatNumber(params.value)}</span>
			),
		},
		{
			field: 'status',
			headerName: t('table.columns.status'),
			width: 120,
			renderCell: (params) => <SfiTransactionStatusChip status={params.value} />,
		},
	]

	const handleReset = () => {
		setParams({
			page: null,
			type: null,
			status: null,
			from: null,
			to: null,
		})
	}

	return (
		<div className="mt-6 flex flex-col gap-4">
			{/* Filter Bar */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="w-full sm:w-70">
					<SfiDateRangePicker
						size="medium"
						value={{ from: params.from, to: params.to }}
						onChange={(range) => setParams({ from: range.from, to: range.to, page: 1 })}
						showPresets
					/>
				</div>
				<div className="w-35 max-sm:flex-1">
					<SfiSingleSelect
						options={PAYMENT_TYPE_OPTIONS}
						value={params.type || 'deposit'}
						onChange={(val) => setParams({ type: (val.target.value as string) || null, page: 1 })}
						size="medium"
						fullWidth
					/>
				</div>
				<div className="w-35 max-sm:flex-1">
					<SfiSingleSelect
						size="medium"
						options={STATUS_OPTIONS}
						value={params.status || 'all'}
						onChange={(val) =>
							setParams({
								status: (val.target.value === 'all' ? null : (val.target.value as string)) || null,
								page: 1,
							})
						}
						fullWidth
					/>
				</div>
				<Button
					variant="outlined"
					size="medium"
					startIcon={<ReplayIcon className="size-4" />}
					onClick={handleReset}
					className="border-mui-divider text-mui-text-primary hover:bg-mui-primary-alpha/5 rounded-lg px-4 font-medium lowercase"
				>
					{commonT('reset')}
				</Button>
			</div>

			<SfiTable params={params} setParams={setParams} rowCount={total} loading={isLoading}>
				<SfiTable.Base rows={transactions} columns={columns} hidePagination autoHeight />
				<SfiTable.Pagination showTotalCount rowsPerPageOptions={[10, 20, 50]} />
			</SfiTable>
		</div>
	)
}

export default FundTab
