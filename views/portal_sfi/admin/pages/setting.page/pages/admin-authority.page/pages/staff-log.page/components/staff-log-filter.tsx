'use client'

import React, { useMemo } from 'react'
import { Box, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

interface StaffLogFilterProps {
	params: ReturnType<typeof useStaffActivitiesTableParams>[0]
	setParams: ReturnType<typeof useStaffActivitiesTableParams>[1]
}

import { useTranslations } from 'next-intl'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import SfiDateRangePicker from '@/components/inputs/sfi-date-range-picker'
import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import {
	resetStaffActivitiesTableParams,
	useStaffActivitiesTableParams,
} from '@/views/portal_sfi/admin/pages/setting.page/pages/admin-authority.page/hooks/use-staff-activities-table-params'

export function StaffLogFilter({ params, setParams }: StaffLogFilterProps) {
	const t = useTranslations('admin.settings.authority')

	const EVENT_OPTIONS = useMemo(
		() => [
			{
				label: t('filter.event.options.created'),
				value: 'created',
			},
			{
				label: t('filter.event.options.updated'),
				value: 'updated',
			},
			{
				label: t('filter.event.options.deleted'),
				value: 'deleted',
			},
		],
		[t]
	)

	const handleReset = () => {
		resetStaffActivitiesTableParams(setParams)
	}

	return (
		<Box className="flex flex-wrap items-center gap-4">
			{/* Search Actor */}
			<Box className="w-full sm:max-w-xs">
				<SfiDebounceTextField
					placeholder={t('filter.actor.placeholder')}
					label={t('filter.actor.label')}
					size="medium"
					value={params.search || ''}
					onDebounce={(val) => setParams({ ...params, search: val ? val : null, page: 1 })}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<SearchIcon fontSize="small" className="text-gray-400" />
								</InputAdornment>
							),
						},
					}}
				/>
			</Box>

			{/* Date Range */}
			<Box className="w-full sm:max-w-xs">
				<SfiDateRangePicker
					size="medium"
					label={t('filter.date_range.label')}
					value={{
						from: (params.from as string) || null,
						to: (params.to as string) || null,
					}}
					onChange={(range) =>
						setParams({
							...params,
							from: range.from,
							to: range.to,
							page: 1,
						})
					}
					showPresets
					showClearButton
				/>
			</Box>

			{/* Event Select */}
			<Box className="w-full sm:max-w-xs">
				<SfiSingleSelect
					label={t('filter.event.label')}
					options={EVENT_OPTIONS}
					value={params.event || ''}
					onChange={(e) =>
						setParams({
							...params,
							event: (e.target.value as string) || null,
							page: 1,
						})
					}
					size="medium"
					fullWidth
				/>
			</Box>

			{/* Reset Button */}
			<Button
				variant="outlined"
				startIcon={<RestartAltIcon />}
				onClick={handleReset}
				size="medium"
				className="px-6"
			>
				{t('table.actions.reset')}
			</Button>
		</Box>
	)
}

export default StaffLogFilter
