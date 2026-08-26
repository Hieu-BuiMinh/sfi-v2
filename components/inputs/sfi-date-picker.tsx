/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { styled } from '@mui/material'
import { Dayjs } from 'dayjs'
import { cn } from '@/utils/cn'

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
	'& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root, & .MuiPickersInputBase-root': {
		backgroundColor: 'var(--token-input-background)',
		'&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline, &:hover:not(.Mui-disabled):not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline':
			{
				borderColor: 'var(--mui-palette-primary-main)',
			},
	},
	'& .MuiInputLabel-root, & .MuiFormLabel-root': {
		color: 'var(--mui-palette-text-secondary)',
	},
	'&.sfi-date-picker-small .MuiOutlinedInput-root, &.sfi-date-picker-small .MuiPickersOutlinedInput-root, &.sfi-date-picker-small .MuiPickersInputBase-root':
		{
			height: 32,
		},
	'&.sfi-date-picker-medium .MuiOutlinedInput-root, &.sfi-date-picker-medium .MuiPickersOutlinedInput-root, &.sfi-date-picker-medium .MuiPickersInputBase-root':
		{
			height: 38,
		},
	'&.sfi-date-picker-large .MuiOutlinedInput-root, &.sfi-date-picker-large .MuiPickersOutlinedInput-root, &.sfi-date-picker-large .MuiPickersInputBase-root':
		{
			height: 50,
		},
	'&.sfi-date-picker-small .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
		transform: 'translate(14px, 5px) scale(1)',
	},
	'&.sfi-date-picker-medium .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
		transform: 'translate(14px, 8px) scale(1)',
	},
	'&.sfi-date-picker-large .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
		transform: 'translate(14px, 14px) scale(1)',
	},
})) as any

export interface SfiDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
	value?: Dayjs | null
	onChange?: (value: Dayjs | null) => void
	size?: 'small' | 'medium' | 'large'
	containerClassName?: string
	helperText?: React.ReactNode
}

export const SfiDatePicker = React.forwardRef<HTMLDivElement, SfiDatePickerProps>(
	({ containerClassName, helperText, size = 'medium', slotProps, ...props }, ref) => {
		return (
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<StyledDatePicker
					{...props}
					ref={ref}
					className={cn(containerClassName, props.className, `sfi-date-picker-${size}`)}
					slotProps={{
						...slotProps,
						textField: {
							...(slotProps?.textField as any),
							margin: 'none',
							size,
							fullWidth: true,
							helperText: helperText || (slotProps?.textField as any)?.helperText,
						},
					}}
				/>
			</LocalizationProvider>
		)
	}
)

SfiDatePicker.displayName = 'SfiDatePicker'

export default SfiDatePicker
