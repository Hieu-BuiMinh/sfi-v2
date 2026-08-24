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
		color: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[100],
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
			color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22,
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500,
		}),
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
