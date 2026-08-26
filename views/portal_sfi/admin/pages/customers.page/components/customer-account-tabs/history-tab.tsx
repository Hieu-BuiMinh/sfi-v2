'use client'

import React, { useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminMt5Service } from '@/services/admin/mt5'
import { formatNumber } from '@/utils/money'
import dayjs from '@/utils/dayjs'
import { GridColDef } from '@mui/x-data-grid'
import { Button, InputAdornment } from '@mui/material'
import { useTranslations } from 'next-intl'
import ReplayIcon from '@mui/icons-material/Replay'
import { useMt5HistoryTableParams } from '../../hooks/use-mt5-history-table-params'
import { SfiOption } from '@/components/inputs/types'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import SfiDateRangePicker from '@/components/inputs/sfi-date-range-picker'
import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import { SfiTable } from '@/components/table'
import { DEFAULT_PAGINATION } from '@/constants/components/pagination/pagination.const'
interface HistoryTabProps {
	accountNo: string
}
import SearchIcon from '@mui/icons-material/Search'

const HistoryTab = ({ accountNo }: HistoryTabProps) => {
	const t = useTranslations('admin.customers.tabs.history_content')
	const commonT = useTranslations('common.button_text')
	const [params, setParams] = useMt5HistoryTableParams()
	const mode = params.type || 'orders'

	const HISTORY_TYPE_OPTIONS: SfiOption[] = [
		{ label: t('options.order_list'), value: 'orders' },
		{ label: t('options.deal_list'), value: 'deals' },
	]

	const historyParams = useMemo(
		() => ({
			page: params.page,
			per_page: params.per_page,
			search: params.search,
			from: params.from ? dayjs(params.from).unix() : null,
			to: params.to ? dayjs(params.to).unix() : null,
		}),
		[params]
	)

	const isOrderMode = mode === 'orders'

	const { data: historyData, isLoading } = useQuery({
		queryKey: isOrderMode
			? adminMt5Service.getOrders.key({
					login: accountNo,
					params: historyParams,
				})
			: adminMt5Service.getDeals.key({
					login: accountNo,
					params: historyParams,
				}),
		queryFn: async () => {
			if (isOrderMode) {
				return (await adminMt5Service.getOrders.get({
					login: accountNo,
					params: historyParams,
				})) as any
			}
			return (await adminMt5Service.getDeals.get({
				login: accountNo,
				params: historyParams,
			})) as any
		},
		placeholderData: keepPreviousData,
		enabled: !!accountNo,
	})

	const rows = (historyData as any)?.data?.data || []
	const total = (historyData as any)?.data?.total || 0

	const orderColumns: GridColDef[] = [
		{ field: 'Symbol', headerName: t('table.columns.symbol'), width: 100 },
		{ field: 'Order', headerName: t('table.columns.ticket'), width: 120 },
		{
			field: 'TimeSetup',
			headerName: t('table.columns.open_time'),
			width: 160,
			renderCell: (p) => dayjs(p.value * 1000).format('DD/MM/YYYY HH:mm'),
		},
		{
			field: 'TimeDone',
			headerName: t('table.columns.closed_time'),
			width: 160,
			renderCell: (p) => dayjs(p.value * 1000).format('DD/MM/YYYY HH:mm'),
		},
		{ field: 'Type', headerName: t('table.columns.type'), width: 100 },
		{
			field: 'VolumeInitial',
			headerName: t('table.columns.volume'),
			width: 100,
		},
		{
			field: 'PriceOrder',
			headerName: t('table.columns.open'),
			width: 120,
			renderCell: (p) => formatNumber(p.value),
		},
		{
			field: 'PriceCurrent',
			headerName: t('table.columns.close'),
			width: 120,
			renderCell: (p) => formatNumber(p.value),
		},
		{ field: 'PriceSL', headerName: t('table.columns.sl'), width: 100 },
		{ field: 'PriceTP', headerName: t('table.columns.tp'), width: 100 },
		{
			field: 'Commission',
			headerName: t('table.columns.commission'),
			width: 120,
			renderCell: () => '-',
		},
		{
			field: 'Storage',
			headerName: t('table.columns.swap'),
			width: 100,
			renderCell: () => '-',
		},
		{
			field: 'CHG',
			headerName: t('table.columns.chg_percent'),
			width: 100,
			renderCell: () => '-',
		},
		{
			field: 'Profit',
			headerName: t('table.columns.closed_pl'),
			width: 130,
			align: 'right',
			headerAlign: 'right',
			renderCell: () => '-',
		},
	]

	const dealColumns: GridColDef[] = [
		{ field: 'Symbol', headerName: t('table.columns.symbol'), width: 100 },
		{ field: 'Deal', headerName: t('table.columns.ticket'), width: 120 },
		{
			field: 'Time',
			headerName: t('table.columns.time'),
			width: 160,
			renderCell: (p) => dayjs(p.value).format('DD/MM/YYYY HH:mm'),
		},
		{ field: 'Order', headerName: t('table.columns.ticket'), width: 120 },
		{
			field: 'Action',
			headerName: t('table.columns.type'),
			width: 100,
			renderCell: () => '',
		},
		{ field: 'Entry', headerName: t('table.columns.direction'), width: 100 },
		{ field: 'Volume', headerName: t('table.columns.volume'), width: 100 },
		{
			field: 'Price',
			headerName: t('table.columns.price'),
			width: 120,
			renderCell: (p) => formatNumber(p.value),
		},
		{ field: 'PriceSL', headerName: t('table.columns.sl'), width: 100 },
		{ field: 'PriceTP', headerName: t('table.columns.tp'), width: 100 },
		{
			field: 'Commission',
			headerName: t('table.columns.commission'),
			width: 120,
			renderCell: (p) => formatNumber(p.value),
		},
		{
			field: 'Storage',
			headerName: t('table.columns.swap'),
			width: 100,
			renderCell: (p) => formatNumber(p.value),
		},
		{
			field: 'Profit',
			headerName: t('table.columns.closed_pl'),
			width: 130,
			align: 'right',
			headerAlign: 'right',
			renderCell: (p) => formatNumber(p.value),
		},
	]

	const handleReset = () => {
		setParams({
			page: null,
			type: 'orders',
			search: null,
			from: null,
			to: null,
		})
	}

	return (
		<div className="mt-6 flex flex-col gap-4">
			{/* Filter Bar */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="w-full sm:max-w-xs">
					<SfiDebounceTextField
						placeholder={t('search_placeholder')}
						size="medium"
						value={params.search || ''}
						onDebounce={(val: string | null) => setParams({ search: val || null, page: 1 })}
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon className="text-mui-text-secondary size-4" />
									</InputAdornment>
								),
							},
						}}
					/>
				</div>
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
						options={HISTORY_TYPE_OPTIONS}
						value={mode}
						onChange={(val) =>
							setParams({
								type: (val.target.value as string) || 'orders',
								page: 1,
							})
						}
						size="medium"
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
				<SfiTable.Base
					rows={rows}
					columns={isOrderMode ? orderColumns : dealColumns}
					getRowId={(p) => (isOrderMode ? p.Order : p.Deal)}
					hidePagination
					autoHeight
				/>
				<SfiTable.Pagination showTotalCount rowsPerPageOptions={DEFAULT_PAGINATION.ROWS_PER_PAGE_OPTIONS} />
			</SfiTable>
		</div>
	)
}

export default HistoryTab
