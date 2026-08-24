/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useRef } from 'react'
import { Box, TextField, Popover, styled, IconButton, TextFieldProps } from '@mui/material'
import { DateRange as ReactDateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import dayjs from 'dayjs'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ClearIcon from '@mui/icons-material/Clear'

const StyledTextField = styled(TextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		borderRadius: '8px',
		backgroundColor: 'var(--token-input-background)',
		'& fieldset': {
			borderColor: 'var(--mui-palette-divider)',
		},
		'&:hover fieldset': {
			borderColor: 'var(--mui-palette-primary-main)',
		},
		'&.Mui-focused fieldset': {
			borderColor: 'var(--mui-palette-primary-main)',
		},
	},
	'& .MuiInputBase-input': {
		color: 'var(--mui-palette-text-primary)',
		cursor: 'pointer',
	},
	'& .MuiInputLabel-root': {
		color: 'var(--mui-palette-text-secondary)',
	},
}))

const StyledPopover = styled(Popover)(({ theme }) => ({
	'& .MuiPopover-paper': {
		marginTop: theme.spacing(1),
		boxShadow: theme.shadows[3],
		borderRadius: theme.spacing(2),
		overflow: 'hidden',
	},
	// Override react-date-range default styles
	'& .rdrCalendarWrapper': {
		backgroundColor: 'var(--mui-palette-background-paper)',
		color: 'var(--mui-palette-text-primary)',
	},
	'& .rdrMonthAndYearWrapper': {
		backgroundColor: 'var(--mui-palette-background-paper)',
		paddingTop: theme.spacing(1),
	},
	'& .rdrMonthPicker select, & .rdrYearPicker select': {
		color: 'var(--mui-palette-text-primary)',
		backgroundColor: 'var(--mui-palette-background-paper)',
	},
	'& .rdrWeekDay': {
		color: 'var(--mui-palette-text-secondary)',
	},
	'& .rdrDay': {
		color: 'var(--mui-palette-text-primary)',
	},
	'& .rdrDayNumber span': {
		color: 'var(--mui-palette-text-primary)',
	},
	'& .rdrDayToday .rdrDayNumber span:after': {
		backgroundColor: 'var(--mui-palette-primary-main)',
	},
	'& .rdrDayPassive .rdrDayNumber span': {
		color: 'var(--mui-palette-text-disabled)',
	},
	'& .rdrStartEdge, & .rdrEndEdge, & .rdrInRange': {
		color: 'var(--mui-palette-primary-contrastText) !important',
	},
	'& .rdrDayStartPreview, & .rdrDayInPreview, & .rdrDayEndPreview': {
		borderColor: 'var(--mui-palette-primary-light)',
	},
}))

export interface DateRange {
	from: string | null // ISO: YYYY-MM-DD
	to: string | null // ISO: YYYY-MM-DD
}

export type PresetRange = 'today' | 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom'

export interface SfiDateRangePickerProps {
	value?: DateRange
	onChange?: (value: DateRange) => void
	label?: string
	placeholder?: string
	format?: string // Display format, default: 'DD/MM/YYYY'
	disabled?: boolean
	size?: TextFieldProps['size']
	minDate?: Date
	maxDate?: Date
	disableFuture?: boolean
	disablePast?: boolean
	showClearButton?: boolean
	textFieldProps?: Partial<TextFieldProps>
	helperText?: React.ReactNode
	error?: boolean
	months?: number // Number of months to display, default: 1
	showPresets?: boolean // Show preset buttons, default: false
}

const getPresetRange = (preset: PresetRange): DateRange => {
	const today = dayjs()

	switch (preset) {
		case 'today':
			return {
				from: today.format('YYYY-MM-DD'),
				to: today.format('YYYY-MM-DD'),
			}
		case 'thisWeek':
			return {
				from: today.startOf('week').format('YYYY-MM-DD'),
				to: today.endOf('week').format('YYYY-MM-DD'),
			}
		case 'thisMonth':
			return {
				from: today.startOf('month').format('YYYY-MM-DD'),
				to: today.endOf('month').format('YYYY-MM-DD'),
			}
		case 'thisYear':
			return {
				from: today.startOf('year').format('YYYY-MM-DD'),
				to: today.endOf('year').format('YYYY-MM-DD'),
			}
		default:
			return { from: null, to: null }
	}
}

const PresetButton = styled('button')<{ selected?: boolean }>(({ theme, selected }) => ({
	padding: '8px 16px',
	fontSize: '0.875rem',
	fontWeight: 500,
	border: '1px solid var(--mui-palette-divider)',
	borderRadius: '6px',
	backgroundColor: selected ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-background-paper)',
	color: selected ? 'var(--mui-palette-primary-contrastText)' : 'var(--mui-palette-text-primary)',
	cursor: 'pointer',
	transition: 'all 0.2s',
	'&:hover': {
		backgroundColor: selected ? 'var(--mui-palette-primary-dark)' : 'var(--mui-palette-action-hover)',
		borderColor: 'var(--mui-palette-primary-main)',
	},
	'&:disabled': {
		opacity: 0.5,
		cursor: 'not-allowed',
	},
}))

export const SfiDateRangePicker = React.forwardRef<HTMLDivElement, SfiDateRangePickerProps>(
	(
		{
			value = { from: null, to: null },
			onChange,
			label,
			placeholder = 'Select date range',
			format = 'DD/MM/YYYY',
			disabled = false,
			size = 'medium',
			minDate,
			maxDate,
			disableFuture = false,
			disablePast = false,
			showClearButton = true,
			textFieldProps = {},
			helperText,
			error = false,
			months = 1,
			showPresets = false,
		},
		ref
	) => {
		const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
		const [selectedPreset, setSelectedPreset] = useState<PresetRange>('custom')
		const inputRef = useRef<HTMLDivElement>(null)

		const fromDate = value.from ? dayjs(value.from).toDate() : null
		const toDate = value.to ? dayjs(value.to).toDate() : null

		const open = Boolean(anchorEl)

		const handleClick = (event: React.MouseEvent<HTMLElement>) => {
			if (!disabled) {
				setAnchorEl(event.currentTarget)
			}
		}

		const handleClose = () => {
			setAnchorEl(null)
		}

		const handleSelect = (ranges: any) => {
			const selection = ranges?.selection

			if (selection?.startDate && selection?.endDate) {
				const start = dayjs(selection.startDate)
				const end = dayjs(selection.endDate)

				onChange?.({
					from: start.format('YYYY-MM-DD'),
					to: end.format('YYYY-MM-DD'),
				})

				// Mark as custom when manually selecting
				setSelectedPreset('custom')

				// Auto-close when both dates are selected and they're different
				if (!start.isSame(end, 'day')) {
					handleClose()
				}
			}
		}

		const handlePresetClick = (preset: PresetRange) => {
			const range = getPresetRange(preset)
			setSelectedPreset(preset)
			onChange?.(range)
			handleClose()
		}

		const handleClear = (event: React.MouseEvent) => {
			event.stopPropagation()
			onChange?.({
				from: null,
				to: null,
			})
		}

		const getDisplayValue = () => {
			if (fromDate && toDate) {
				return `${dayjs(fromDate).format(format)} – ${dayjs(toDate).format(format)}`
			}
			if (fromDate) {
				return `${dayjs(fromDate).format(format)} – ...`
			}
			return ''
		}

		const hasValue = value.from && value.to

		// Determine min/max dates
		const effectiveMinDate = disablePast ? new Date() : minDate || new Date(1900, 0, 1)
		const effectiveMaxDate = disableFuture ? new Date() : maxDate

		return (
			<Box ref={ref}>
				<StyledTextField
					ref={inputRef}
					label={label}
					value={getDisplayValue()}
					placeholder={placeholder}
					onClick={handleClick}
					disabled={disabled}
					error={error}
					helperText={helperText}
					fullWidth
					size={size}
					slotProps={{
						input: {
							readOnly: true,
							endAdornment: (
								<div className="flex gap-1">
									{showClearButton && hasValue && !disabled && (
										<IconButton
											size="small"
											onClick={handleClear}
											className="text-text-secondary hover:text-error-main"
										>
											<ClearIcon fontSize="small" />
										</IconButton>
									)}
									<IconButton
										size="small"
										onClick={handleClick}
										disabled={disabled}
										className="text-text-secondary"
									>
										<CalendarTodayIcon fontSize="small" />
									</IconButton>
								</div>
							),
						},
					}}
					{...textFieldProps}
				/>

				<StyledPopover
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					<div className="flex gap-2 p-4">
						{showPresets && (
							<div className="mb-4 flex flex-col flex-wrap gap-2">
								<PresetButton
									selected={selectedPreset === 'today'}
									onClick={() => handlePresetClick('today')}
									disabled={disabled}
								>
									Today
								</PresetButton>
								<PresetButton
									selected={selectedPreset === 'thisWeek'}
									onClick={() => handlePresetClick('thisWeek')}
									disabled={disabled}
								>
									This Week
								</PresetButton>
								<PresetButton
									selected={selectedPreset === 'thisMonth'}
									onClick={() => handlePresetClick('thisMonth')}
									disabled={disabled}
								>
									This Month
								</PresetButton>
								<PresetButton
									selected={selectedPreset === 'thisYear'}
									onClick={() => handlePresetClick('thisYear')}
									disabled={disabled}
								>
									This Year
								</PresetButton>
							</div>
						)}
						<ReactDateRange
							ranges={[
								{
									startDate: fromDate || new Date(),
									endDate: toDate || new Date(),
									key: 'selection',
								},
							]}
							onChange={handleSelect}
							months={months}
							direction={months > 1 ? 'horizontal' : 'vertical'}
							showDateDisplay={false}
							moveRangeOnFirstSelection={false}
							rangeColors={['var(--mui-palette-primary-main)']}
							color="var(--mui-palette-primary-main)"
							minDate={effectiveMinDate}
							maxDate={effectiveMaxDate}
						/>
					</div>
				</StyledPopover>
			</Box>
		)
	}
)

SfiDateRangePicker.displayName = 'SfiDateRangePicker'

export default SfiDateRangePicker

/**
 * Usage Examples:
 *
 * Example 1: Basic usage
 * ```tsx
 * const [dateRange, setDateRange] = useState<DateRange>({
 *   from: null,
 *   to: null
 * })
 *
 * <SfiDateRangePicker
 *   value={dateRange}
 *   onChange={setDateRange}
 * />
 * ```
 *
 * Example 2: With URL params (useTableParams)
 * ```tsx
 * const [params, setParams] = useTableParams()
 *
 * <SfiDateRangePicker
 *   value={{
 *     from: params.from,
 *     to: params.to
 *   }}
 *   onChange={(range) => setParams({
 *     from: range.from,
 *     to: range.to,
 *     page: 1
 *   })}
 *   label="Period"
 *   showClearButton
 *   showPresets
 * />
 * ```
 *
 * Example 3: Two months side-by-side with presets
 * ```tsx
 * <SfiDateRangePicker
 *   value={dateRange}
 *   onChange={setDateRange}
 *   months={2}
 *   label="Date Range"
 *   placeholder="Select date range"
 *   showPresets
 * />
 * ```
 *
 * Example 4: With validation and constraints
 * ```tsx
 * <SfiDateRangePicker
 *   value={dateRange}
 *   onChange={setDateRange}
 *   error={!dateRange.from || !dateRange.to}
 *   helperText={
 *     !dateRange.from || !dateRange.to
 *       ? 'Please select both dates'
 *       : ''
 *   }
 *   disableFuture
 *   minDate={new Date(2024, 0, 1)}
 *   showPresets
 * />
 * ```
 *
 * Example 5: With React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form'
 * import { RfhSfiDateRangePicker } from '@/components/refactored/form-input/sfi/rfh-sfi-date-range-picker'
 *
 * const { control } = useForm<FormData>()
 *
 * <RfhSfiDateRangePicker
 *   name="dateRange"
 *   control={control}
 *   label="Date Range"
 *   showPresets
 *   rules={{ required: 'Please select a date range' }}
 * />
 * ```
 */
