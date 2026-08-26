'use client'

import { customerAccountService } from '@/services/customer/account'
import { AccountItemByType } from '@/services/customer/account/account-res.dto'
import { formatMoney } from '@/utils/money'
import { GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useAccountListTableParams } from '../hooks/use-account-list-table-params'
import AccountStatusSfiChip from '@/components/chips/account-chip/acount-status-chip'
import { SfiTable } from '@/components/table'
import { DEFAULT_PAGINATION } from '@/constants/components/pagination/pagination.const'

export default function LiveAccountList() {
	const t = useTranslations('customer.accounts')
	const [params, setParams] = useAccountListTableParams('live')

	const { data: response, isLoading } = useQuery({
		queryKey: customerAccountService.getAccountListByType.key({ type: 'LIVE' }),
		queryFn: () => customerAccountService.getAccountListByType.get({ type: 'LIVE' }),
	})

	const accounts = response?.data || []

	const columns: GridColDef<AccountItemByType>[] = [
		{
			field: 'Balance',
			headerName: t('table.columns.balance'),
			flex: 1,
			minWidth: 150,
			valueFormatter: (value) => formatMoney(value, { currency: 'USD', useSymbol: true, spaceBetween: false }),
		},
		{
			field: 'Equity',
			headerName: t('table.columns.equity'),
			flex: 1,
			minWidth: 150,
			valueGetter: (_, row) => row.mt5_account?.Equity || '0.00',
			valueFormatter: (value) => formatMoney(value, { currency: 'USD', useSymbol: true, spaceBetween: false }),
		},
		{
			field: 'margin',
			headerName: t('table.columns.margin_used_free'),
			flex: 1,
			minWidth: 180,
			valueGetter: (_, row) =>
				`${formatMoney(row.mt5_account?.Margin || 0, { currency: 'USD', useSymbol: true, spaceBetween: false })} / ${formatMoney(row.mt5_account?.MarginFree || 0, { currency: 'USD', useSymbol: true, spaceBetween: false })}`,
		},
		{
			field: 'upnl',
			headerName: t('table.columns.upnl'),
			flex: 1,
			minWidth: 150,
			valueGetter: (_, row) => row.mt5_account?.Floating || '0.00',
			valueFormatter: (value) => formatMoney(value, { currency: 'USD', useSymbol: true, spaceBetween: false }),
		},
		{
			field: 'active',
			headerName: t('table.columns.status'),
			flex: 1,
			minWidth: 120,
			renderCell: (params) => <AccountStatusSfiChip active={params.value} />,
		},
	]

	return (
		<SfiTable params={params} setParams={setParams} rowCount={accounts.length} loading={isLoading}>
			<SfiTable.Base
				rows={accounts}
				columns={columns}
				paginationMode="client"
				sortingMode="client"
				hidePagination
				autoHeight
				getRowId={(row) => row.Login}
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
