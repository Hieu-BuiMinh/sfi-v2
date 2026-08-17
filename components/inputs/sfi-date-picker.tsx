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
})) as any

export interface SfiDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
	value?: Dayjs | null
	onChange?: (value: Dayjs | null) => void
	containerClassName?: string
	helperText?: React.ReactNode
}

export const SfiDatePicker = React.forwardRef<HTMLDivElement, SfiDatePickerProps>(
	({ containerClassName, helperText, slotProps, ...props }, ref) => {
		return (
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<StyledDatePicker
					{...props}
					ref={ref}
					className={cn(containerClassName, props.className)}
					slotProps={{
						...slotProps,
						textField: {
							...(slotProps?.textField as any),
							margin: 'dense',
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
