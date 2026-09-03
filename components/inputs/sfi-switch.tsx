import { Switch as MuiSwitch, SwitchProps, styled, FormControlLabel, FormControl, FormHelperText } from '@mui/material'
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 2,
		color: 'var(--mui-palette-grey-500)',
		transitionDuration: '300ms',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: 'var(--mui-palette-primary-main)',
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.5,
			},
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: 'var(--mui-palette-primary-main)',
			border: '6px solid #fff',
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			color: 'var(--mui-palette-action-disabled)',
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: 1,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22,
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: 'var(--mui-palette-action-disabledBackground)',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500,
		}),
	},
	'&.MuiSwitch-sizeSmall': {
		width: 34,
		height: 20,
		'& .MuiSwitch-switchBase': {
			margin: 2,
			'&.Mui-checked': {
				transform: 'translateX(14px)',
			},
		},
		'& .MuiSwitch-thumb': {
			width: 16,
			height: 16,
		},
		'& .MuiSwitch-track': {
			borderRadius: 10,
		},
	},
}))

export type SfiSwitchProps = SwitchProps & {
	label?: ReactNode
	error?: boolean
	helperText?: ReactNode
	containerClassName?: string
}

export const SfiSwitch = ({ label, error, helperText, containerClassName, className, ...props }: SfiSwitchProps) => {
	return (
		<FormControl error={error} className={cn('w-full', containerClassName)}>
			<FormControlLabel
				control={<StyledSwitch {...props} className={cn(className, 'ml-3')} />}
				label={
					<span className={cn('ml-3 text-sm', error ? 'text-mui-error-main' : 'text-mui-text-primary')}>
						{label}
					</span>
				}
			/>
			{helperText && <FormHelperText className="mx-0">{helperText}</FormHelperText>}
		</FormControl>
	)
}

export default SfiSwitch
