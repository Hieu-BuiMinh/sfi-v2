'use client'

import { adminOrdersService } from '@/services/admin/orders'
import { OrderHistoryResponse } from '@/services/admin/orders/orders-res.dto'
import { formatMoney } from '@/utils/money'
import { Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { GridColDef } from '@mui/x-data-grid'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'
import React from 'react'
import { useOrderHistoryTableParams } from '../../hooks/use-order-history-table-params'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import SfiDateRangePicker from '@/components/inputs/sfi-date-range-picker'
import { SfiTable } from '@/components/table'
import { DEFAULT_PAGINATION } from '@/constants/components/pagination/pagination.const'

interface OrderHistoryProps {
	loginId: string
}

export default function OrderHistory({ loginId }: OrderHistoryProps) {
	const t = useTranslations('customer.positions.order_history')
	const [params, setParams] = useOrderHistoryTableParams()

	const { data: response, isLoading } = useQuery({
		queryKey: adminOrdersService.getOrderHistory.key({
			idLogin: loginId,
			page: params.page,
			perPage: params.per_page,
			search: params.search,
			from: params.from,
			to: params.to,
		}),
		queryFn: () =>
			adminOrdersService.getOrderHistory.get({
				idLogin: loginId,
				page: params.page,
				perPage: params.per_page,
				search: params.search,
				from: params.from,
				to: params.to,
			}),
		placeholderData: keepPreviousData,
		enabled: !!loginId,
	})

	const orders = response?.data?.list || []
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

	const columns: GridColDef<OrderHistoryResponse['list'][number]>[] = [
		{
			field: 'order',
			headerName: t('table.columns.order_id'),
			width: 150,
			renderCell: (params) => <span className="text-mui-primary font-semibold">{params.value}</span>,
		},
		{
			field: 'symbol',
			headerName: t('table.columns.symbol'),
			width: 120,
		},
		{
			field: 'type',
			headerName: t('table.columns.type'),
			width: 120,
			valueGetter: (value) => {
				const types: Record<number, string> = {
					0: t('types.buy'),
					1: t('types.sell'),
					2: t('types.buy_limit'),
					3: t('types.sell_limit'),
					4: t('types.buy_stop'),
					5: t('types.sell_stop'),
					6: t('types.buy_stop_limit'),
					7: t('types.sell_stop_limit'),
				}
				return types[value] || t('types.other', { value })
			},
		},
		{
			field: 'volumeInitial',
			headerName: t('table.columns.volume'),
			width: 120,
			valueGetter: (value) => (value / 10000).toFixed(2),
		},
		{
			field: 'priceOrder',
			headerName: t('table.columns.price_order'),
			width: 150,
			valueFormatter: (value) => formatMoney(value, { currency: 'USD' }),
		},
		{
			field: 'priceCurrent',
			headerName: t('table.columns.price_current'),
			width: 150,
			valueFormatter: (value) => formatMoney(value, { currency: 'USD' }),
		},
		{
			field: 'priceSL',
			headerName: t('table.columns.sl'),
			width: 120,
			valueFormatter: (value) => (value ? formatMoney(value, { currency: 'USD' }) : '-'),
		},
		{
			field: 'priceTP',
			headerName: t('table.columns.tp'),
			width: 120,
			valueFormatter: (value) => (value ? formatMoney(value, { currency: 'USD' }) : '-'),
		},
		{
			field: 'timeSetup',
			headerName: t('table.columns.time_setup'),
			width: 180,
			valueFormatter: (value) => (value ? dayjs(value * 1000).format('DD/MM/YYYY HH:mm:ss') : '-'),
		},
		{
			field: 'state',
			headerName: t('table.columns.status'),
			width: 150,
			valueGetter: (value) => {
				const states: Record<number, string> = {
					0: t('states.started'),
					1: t('states.placed'),
					2: t('states.canceled'),
					3: t('states.partial'),
					4: t('states.filled'),
					5: t('states.rejected'),
					6: t('states.expired'),
				}
				return states[value] || t('states.other', { value })
			},
		},
	]

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="w-full sm:max-w-xs">
					<SfiDebounceTextField
						placeholder={t('search_placeholder')}
						size="medium"
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
						className="border-mui-divider text-mui-text-primary hover:border-mui-primary-main"
						sx={{ borderRadius: '8px', textTransform: 'none' }}
					>
						{t('reset')}
					</Button>
				</div>
			</div>
			<SfiTable params={params} setParams={setParams} rowCount={total} loading={isLoading}>
				<SfiTable.Base rows={orders} columns={columns} getRowId={(row) => row.order} hidePagination />

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
