'use client'

import { InputAdornment, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslations } from 'next-intl'
import { useTableParams } from '@/hooks/use-table-params'
import { useDevice } from '@/hooks/use-device'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import { TRANSACTION_STATUS } from '@/constants/sfi/transactions.const'
import SfiDateRangePicker from '@/components/inputs/sfi-date-range-picker'

interface AdminTransactionFilterProps {
	params: ReturnType<typeof useTableParams>[0]
	setParams: ReturnType<typeof useTableParams>[1]
}

const AdminTransactionFilter = ({ params, setParams }: AdminTransactionFilterProps) => {
	const t = useTranslations('admin.transactions.list.filter')
	const { isMobile } = useDevice()

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

	return (
		<div className="flex flex-wrap items-center justify-between gap-4">
			<div className="w-full sm:max-w-xs">
				<SfiDebounceTextField
					placeholder={t('search.placeholder')}
					size="medium"
					label={t('search.label')}
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
			<div className="flex flex-wrap items-center gap-2 max-sm:flex-1">
				<SfiSingleSelect
					size="medium"
					sx={{ width: 150 }}
					value={params.status || 'all'}
					onChange={(e) =>
						setParams({
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							status: e.target.value === 'all' ? null : (e.target.value as any),
							page: 1,
						})
					}
					options={[
						{ label: t('status.all'), value: 'all' },
						{
							label: t('status.pending'),
							value: TRANSACTION_STATUS.PENDING.toString(),
						},
						{
							label: t('status.approved'),
							value: TRANSACTION_STATUS.APPROVED.toString(),
						},
						{
							label: t('status.processing'),
							value: TRANSACTION_STATUS.PROCESSING.toString(),
						},
						{
							label: t('status.rejected'),
							value: TRANSACTION_STATUS.REJECTED.toString(),
						},
					]}
					defaultValue="all"
					className="w-full"
					fullWidth={isMobile}
				/>
				<SfiDateRangePicker
					size="medium"
					label=""
					placeholder={t('date_range.placeholder')}
					value={{ from: params.from, to: params.to }}
					onChange={(range) => setParams({ from: range.from, to: range.to, page: 1 })}
					showPresets
				/>
				<Button
					variant="outlined"
					size="medium"
					onClick={handleReset}
					className="border-mui-divider text-mui-text-primary hover:border-mui-primary-main"
					sx={{ borderRadius: '8px', textTransform: 'none', px: 3 }}
				>
					{t('reset')}
				</Button>
			</div>
		</div>
	)
}

export default AdminTransactionFilter
