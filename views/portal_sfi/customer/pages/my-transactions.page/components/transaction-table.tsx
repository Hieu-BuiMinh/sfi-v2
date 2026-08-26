/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import SfiTransactionStatusChip from '@/components/chips/transaction-status-chip'
import SfiDateRangePicker from '@/components/inputs/sfi-date-range-picker'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import { SfiTable } from '@/components/table'
import { DEFAULT_PAGINATION } from '@/constants/components/pagination/pagination.const'
import { useDevice } from '@/hooks/use-device'
import { useCustomerTransactionsTableParams } from '../hooks/use-customer-transactions-table-params'
import { customerFinanceTransactionsService } from '@/services/customer/finance/transactions'
import { TransactionItem } from '@/services/customer/finance/transactions/transactions-res.dto'
import { formatMoney } from '@/utils/money'
import SearchIcon from '@mui/icons-material/Search'
import { Button, InputAdornment } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'

interface TransactionTableProps {
	loginId: string
	type: 'deposit' | 'withdraw'
}

export default function TransactionTable({ loginId, type }: TransactionTableProps) {
	const t = useTranslations('customer.transactions.table')
	const { isMobile, isTablet } = useDevice()
	const [params, setParams] = useCustomerTransactionsTableParams(type)

	const service =
		type === 'deposit'
			? customerFinanceTransactionsService.getDepositList
			: customerFinanceTransactionsService.getWithdrawalList

	const { data: response, isLoading } = useQuery({
		queryKey: service.key({
			id: loginId,
			page: params.page,
			perPage: params.per_page,
			search: params.search,
			status: params.status,
			created_date:
				params.from && params.to
					? `${dayjs(params.from).format('YYYY-MM-DD')}|${dayjs(params.to).format('YYYY-MM-DD')} 23:59:59`
					: null,
		}),
		queryFn: () =>
			service.get({
				id: loginId,
				page: params.page,
				perPage: params.per_page,
				search: params.search,
				status: params.status,
				created_date:
					params.from && params.to
						? `${dayjs(params.from).format('YYYY-MM-DD')}|${dayjs(params.to).format('YYYY-MM-DD')} 23:59:59`
						: null,
			}),
		placeholderData: keepPreviousData,
		enabled: !!loginId,
	})

	const transactions = response?.data?.data || []
	const total = response?.data?.total || 0

	const handleReset = () => {
		setParams({
			search: null,
			from: null,
			to: null,
			status: null,
			page: 1,
			per_page: 10,
		})
	}

	const columns: GridColDef<TransactionItem>[] = [
		{
			field: 'id',
			headerName: t('columns.id'),
			width: 100,
			renderCell: (params) => <span className="text-mui-primary font-semibold">#{params.value}</span>,
		},
		{
			field: 'created_at',
			headerName: t('columns.date'),
			width: 180,
			valueFormatter: (value) => (value ? dayjs(value * 1000).format('DD/MM/YYYY HH:mm:ss') : '-'),
		},
		{
			field: 'payment_platform_method',
			headerName: t('columns.method'),
			width: 200,
		},
		{
			field: 'amount',
			headerName: t('columns.amount'),
			width: 150,
			valueGetter: (_, row) => `${formatMoney(row.amount)} ${row.currency}`,
		},
		{
			field: 'beneficiary_bank',
			headerName: t('columns.beneficiary_bank'),
			width: 250,
			renderCell: (params) => {
				const bank = params.value
				if (!bank) return '-'
				return (
					<div className="flex flex-col gap-1 py-2 text-xs leading-tight">
						<span className="font-semibold">{bank.beneficiary_bank_name}</span>
						<span className="text-mui-text-secondary">{bank.beneficiary_account_number}</span>
					</div>
				)
			},
		},
		{
			field: 'actual_amount',
			headerName: t('columns.verify_amount'),
			width: 150,
			valueGetter: (_, row) => (row.verified_amount ? `${formatMoney(row.verified_amount)} USD` : '-'),
		},
		{
			field: 'status',
			headerName: t('columns.status'),
			width: 150,
			renderCell: (params) => <SfiTransactionStatusChip status={params.value} />,
		},
	]

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="w-full sm:max-w-xs">
					<SfiDebounceTextField
						placeholder={t('search_placeholder')}
						size="medium"
						label={t('search')}
						value={params.search || ''}
						onDebounce={(val) => setParams({ search: val ? val : null, page: 1 })}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position="end">
										<SearchIcon fontSize="small" />
									</InputAdornment>
								),
							},
						}}
					/>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<SfiSingleSelect
						size="medium"
						sx={{ width: 150 }}
						value={params.status || 'all'}
						onChange={(e) => setParams({ status: (e.target.value as any) || null, page: 1 })}
						options={[
							{ label: t('status_filter.all'), value: 'all' },
							{ label: t('status_filter.progressing'), value: '0' },
							{ label: t('status_filter.approved'), value: '1' },
							{ label: t('status_filter.rejected'), value: '-1' },
						]}
						defaultValue="all"
						fullWidth={isMobile}
						className="max-sm:w-full"
					/>
					<SfiDateRangePicker
						size="medium"
						label=""
						placeholder={t('date_range_placeholder')}
						value={{ from: params.from, to: params.to }}
						onChange={(range) => setParams({ from: range.from, to: range.to, page: 1 })}
						showPresets
					/>
					<Button
						variant="outlined"
						size="medium"
						onClick={handleReset}
						className="border-mui-divider text-mui-text-primary hover:border-mui-primary-main flex-1"
						sx={{ borderRadius: '8px', textTransform: 'none' }}
					>
						{t('reset')}
					</Button>
				</div>
			</div>
			<SfiTable params={params} setParams={setParams} rowCount={total} loading={isLoading}>
				<SfiTable.Base rows={transactions} columns={columns} getRowId={(row) => row.id} hidePagination />

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
