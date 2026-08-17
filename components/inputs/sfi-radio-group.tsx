/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode } from 'react'
import {
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Radio,
	RadioGroup,
	RadioGroupProps,
	styled,
} from '@mui/material'
import { SfiOption } from './types'
import { cn } from '@/utils/cn'

export type SfiRadioGroupProps = RadioGroupProps & {
	options?: SfiOption[]
	label?: string
	helperText?: ReactNode
	error?: boolean
	containerClassName?: string
	disabled?: boolean
}

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
	'& .MuiTypography-root': {
		fontSize: '0.875rem',
		color: 'var(--mui-palette-text-primary)',
	},
}))

export const SfiRadioGroup = React.forwardRef<HTMLDivElement, SfiRadioGroupProps>(
	({ options, label, helperText, error, containerClassName, className, disabled, ...props }, ref) => {
		return (
			<FormControl error={error} disabled={disabled} className={cn(containerClassName)} component="fieldset">
				{label && (
					<FormLabel component="legend" className="text-mui-text-secondary mb-2 text-sm font-medium">
						{label}
					</FormLabel>
				)}
				<RadioGroup {...props} ref={ref} className={cn(className)}>
					{options?.map((option) => (
						<StyledFormControlLabel
							key={option.value}
							value={option.value}
							control={<Radio size="small" />}
							label={option.label}
							disabled={option.disabled}
						/>
					))}
					{props.children}
				</RadioGroup>
				{helperText && <FormHelperText className="mx-0">{helperText}</FormHelperText>}
			</FormControl>
		)
	}
)

SfiRadioGroup.displayName = 'SfiRadioGroup'

export default SfiRadioGroup
