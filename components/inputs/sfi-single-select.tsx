/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	MenuItemProps,
	Select as MuiSelect,
	SelectProps,
	styled,
} from '@mui/material'
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { SfiOption } from '@/components/inputs/types'

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
	backgroundColor: 'var(--token-input-background)',
	color: 'var(--mui-palette-text-primary)',
	'& .MuiOutlinedInput-notchedOutline': {
		// borderRadius: '8px',
		borderColor: 'var(--mui-palette-divider)',
	},
	'&:hover .MuiOutlinedInput-notchedOutline': {
		borderColor: 'var(--mui-palette-primary-main)',
	},
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: 'var(--mui-palette-primary-main)',
	},
	'& .MuiSelect-icon': {
		color: 'var(--mui-palette-text-secondary)',
	},
}))

export type SfiSingleSelectProps = Omit<SelectProps, 'multiple'> & {
	options?: SfiOption[]
	children?: ReactNode
	placeholder?: ReactNode
	menuItemProps?: MenuItemProps
	containerClassName?: string
	helperText?: ReactNode
}

export const SfiSingleSelect = ({
	options,
	children,
	placeholder,
	menuItemProps,
	label,
	id,
	labelId,
	fullWidth = false,
	className,
	containerClassName,
	error,
	helperText,
	displayEmpty,
	renderValue,
	...props
}: SfiSingleSelectProps) => {
	const generatedLabelId = labelId || (props.name ? `${props.name}-label` : id ? `${id}-label` : undefined)

	return (
		<FormControl
			fullWidth={fullWidth}
			className={cn(containerClassName)}
			size={props.size}
			error={error}
			margin="none"
		>
			{label && (
				<InputLabel id={generatedLabelId} className="text-mui-text-secondary">
					{label}
				</InputLabel>
			)}
			<StyledSelect
				fullWidth={fullWidth}
				label={label}
				labelId={generatedLabelId}
				id={id}
				className={className}
				error={error}
				multiple={false}
				displayEmpty={displayEmpty || Boolean(placeholder)}
				renderValue={
					placeholder
						? (selected) => {
								if (selected === '') {
									return <span className="text-mui-text-disabled">{placeholder}</span>
								}

								return (
									renderValue?.(selected) ??
									options?.find((option) => option.value === selected)?.label ??
									String(selected)
								)
							}
						: renderValue
				}
				{...props}
			>
				{options
					? options.map((option) => (
							<MenuItem
								key={option.value}
								value={option.value}
								disabled={option.disabled}
								{...menuItemProps}
							>
								{option.label}
							</MenuItem>
						))
					: children}
			</StyledSelect>
			{helperText && <FormHelperText className="mx-0">{helperText}</FormHelperText>}
		</FormControl>
	)
}

export default SfiSingleSelect
