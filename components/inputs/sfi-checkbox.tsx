/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Checkbox as MuiCheckbox,
	CheckboxProps,
	FormControl,
	FormControlLabel,
	FormHelperText,
	styled,
} from '@mui/material'
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
	'&:hover': {
		backgroundColor: 'transparent',
	},
	// padding: 0,
	// marginRight: 8,
}))

export type SfiCheckboxProps = CheckboxProps & {
	label?: ReactNode
	error?: boolean
	helperText?: ReactNode
	containerClassName?: string
}

export const SfiCheckbox = ({
	label,
	error,
	helperText,
	containerClassName,
	className,
	...props
}: SfiCheckboxProps) => {
	return (
		<FormControl error={error} className={cn('w-full', containerClassName)}>
			<FormControlLabel
				control={
					<StyledCheckbox
						icon={<UncheckedIcon disabled={props.disabled} />}
						checkedIcon={<CheckedIcon disabled={props.disabled} />}
						className={cn(className, 'pl-3')}
						{...props}
					/>
				}
				label={
					<span
						className={cn(
							'text-sm transition-colors',
							props.disabled
								? 'text-mui-text-disabled'
								: error
									? 'text-mui-error-main'
									: 'text-mui-text-primary'
						)}
					>
						{label}
					</span>
				}
			/>
			{helperText && <FormHelperText className="mx-0">{helperText}</FormHelperText>}
		</FormControl>
	)
}

export default SfiCheckbox

const UncheckedIcon = ({ disabled }: { disabled?: boolean }) => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M4 0.5H16C17.933 0.5 19.5 2.067 19.5 4V16C19.5 17.933 17.933 19.5 16 19.5H4C2.067 19.5 0.5 17.933 0.5 16V4C0.5 2.067 2.067 0.5 4 0.5Z"
			fill="transparent"
		/>
		<path
			d="M4 0.5H16C17.933 0.5 19.5 2.067 19.5 4V16C19.5 17.933 17.933 19.5 16 19.5H4C2.067 19.5 0.5 17.933 0.5 16V4C0.5 2.067 2.067 0.5 4 0.5Z"
			stroke={disabled ? '#DFE4EA' : 'var(--mui-palette-primary-main)'}
		/>
	</svg>
)

const CheckedIcon = ({ disabled }: { disabled?: boolean }) => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M4 0.5H16C17.933 0.5 19.5 2.067 19.5 4V16C19.5 17.933 17.933 19.5 16 19.5H4C2.067 19.5 0.5 17.933 0.5 16V4C0.5 2.067 2.067 0.5 4 0.5Z"
			fillOpacity={disabled ? '0.12' : '0.24'}
			fill={disabled ? '#DFE4EA' : 'currentColor'}
			className={cn(!disabled && 'fill-mui-primary dark:fill-mui-secondary')}
		/>
		<path
			d="M4 0.5H16C17.933 0.5 19.5 2.067 19.5 4V16C19.5 17.933 17.933 19.5 16 19.5H4C2.067 19.5 0.5 17.933 0.5 16V4C0.5 2.067 2.067 0.5 4 0.5Z"
			strokeWidth="1"
			stroke={disabled ? '#DFE4EA' : 'currentColor'}
			className={cn(!disabled && 'stroke-mui-primary')}
		/>
		<path
			d="M14 7L8.5 12.5L6 10"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			stroke={disabled ? '#9CA3AF' : 'currentColor'}
			className={cn(!disabled && 'stroke-mui-primary dark:stroke-white')}
		/>
	</svg>
)
