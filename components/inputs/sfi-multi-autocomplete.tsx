/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Autocomplete as MuiAutocomplete,
	AutocompleteProps as MuiAutocompleteProps,
	FormControl,
	FormHelperText,
	Paper,
	keyframes,
	styled,
} from '@mui/material'

import { ReactNode } from 'react'
import { SfiOption } from './types'
import { cn } from '@/utils/cn'
import SfiTextField from './sfi-textfield'

const openDropdown = keyframes({
	from: {
		opacity: 0,
		transform: 'translateY(-4px)',
	},
	to: {
		opacity: 1,
		transform: 'translateY(0)',
	},
})

const AnimatedPaper = styled(Paper)({
	animation: `${openDropdown} 150ms ease-out`,
	'@media (prefers-reduced-motion: reduce)': {
		animation: 'none',
	},
})

const autocompleteHeights = {
	small: 32,
	medium: 38,
	large: 50,
}

const StyledAutocomplete = styled(MuiAutocomplete)(({ size = 'medium' }) => ({
	'& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot': {
		minHeight: autocompleteHeights[size],
		paddingTop: 0,
		paddingBottom: 0,
	},
	'& .MuiAutocomplete-inputRoot .MuiAutocomplete-input': {
		paddingTop: '0 !important',
		paddingBottom: '0 !important',
	},
	'& .MuiInputBase-input': {
		color: 'var(--mui-palette-text-primary)',
	},
	'& .MuiAutocomplete-endAdornment .MuiIconButton-root': {
		color: 'var(--mui-palette-text-secondary)',
	},
})) as typeof MuiAutocomplete

export interface SfiMultiAutocompleteProps<
	T = SfiOption,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
> extends Omit<MuiAutocompleteProps<T, true, DisableClearable, FreeSolo>, 'renderInput' | 'multiple'> {
	label?: ReactNode
	error?: boolean
	helperText?: ReactNode
	containerClassName?: string
	placeholder?: string
}

export function SfiMultiAutocomplete<
	T = SfiOption,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
>(props: SfiMultiAutocompleteProps<T, DisableClearable, FreeSolo>) {
	const { label, error, helperText, containerClassName, placeholder, options = [], ...rest } = props

	return (
		<FormControl fullWidth error={error} className={cn('m-0 w-full', containerClassName)}>
			<StyledAutocomplete
				{...(rest as any)}
				slots={{ ...props.slots, paper: props.slots?.paper || AnimatedPaper }}
				slotProps={{
					...props.slotProps,
					chip: {
						...(props.slotProps?.chip as object),
						size: 'small',
					},
				}}
				options={options}
				multiple={true}
				getOptionLabel={
					props.getOptionLabel || ((option: any) => option?.label?.toString() || option?.value || '')
				}
				renderOption={
					props.renderOption ||
					((optProps: any, option: any) => {
						const { key, ...otherProps } = optProps
						return (
							<li key={key} {...otherProps}>
								{option.label}
							</li>
						)
					})
				}
				renderInput={(params) => (
					<SfiTextField
						{...params}
						label={label as any}
						placeholder={placeholder}
						variant="outlined"
						error={error}
						size={props.size}
					/>
				)}
			/>
			{helperText && <FormHelperText className="mx-0">{helperText}</FormHelperText>}
		</FormControl>
	)
}

export default SfiMultiAutocomplete
