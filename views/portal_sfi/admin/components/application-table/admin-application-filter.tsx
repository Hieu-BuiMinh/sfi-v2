/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import SfiDateRangePicker from '@/components/inputs/sfi-date-range-picker'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import { useDevice } from '@/hooks/use-device'
import { useTableParams } from '@/hooks/use-table-params'
import SearchIcon from '@mui/icons-material/Search'
import { Button, InputAdornment } from '@mui/material'
import { useTranslations } from 'next-intl'

interface AdminApplicationFilterProps {
	params: ReturnType<typeof useTableParams>[0]
	setParams: ReturnType<typeof useTableParams>[1]
}

const AdminApplicationFilter = ({ params, setParams }: AdminApplicationFilterProps) => {
	const t = useTranslations('admin.applications.filter')
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
							status: e.target.value === 'all' ? null : (e.target.value as any),
							page: 1,
						})
					}
					options={[
						{ label: t('status.all'), value: 'all' },
						{ label: t('status.not_started'), value: '0' },
						{ label: t('status.approved'), value: '1' },
						{ label: t('status.rejected'), value: '2' },
						{ label: t('status.pending'), value: '3' },
						{ label: t('status.processing'), value: '4' },
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

export default AdminApplicationFilter
