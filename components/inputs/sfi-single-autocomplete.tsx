/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Autocomplete as MuiAutocomplete,
	AutocompleteProps as MuiAutocompleteProps,
	TextField,
	styled,
	FormControl,
	FormHelperText,
} from '@mui/material'

import { ReactNode } from 'react'
import { SfiOption } from './types'
import { cn } from '@/utils/cn'

const StyledAutocomplete = styled(MuiAutocomplete)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		backgroundColor: 'var(--token-input-background)',
	},
})) as typeof MuiAutocomplete

export interface SfiSingleAutocompleteProps<
	T = SfiOption,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
> extends Omit<MuiAutocompleteProps<T, false, DisableClearable, FreeSolo>, 'renderInput' | 'multiple'> {
	label?: ReactNode
	error?: boolean
	helperText?: ReactNode
	containerClassName?: string
}

export function SfiSingleAutocomplete<
	T = SfiOption,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
>(props: SfiSingleAutocompleteProps<T, DisableClearable, FreeSolo>) {
	const { label, error, helperText, containerClassName, options = [], ...rest } = props

	return (
		<FormControl fullWidth error={error} margin="dense" className={cn('w-full', containerClassName)}>
			<StyledAutocomplete
				{...(rest as any)}
				options={options}
				multiple={false}
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
					<TextField {...params} label={label as any} variant="outlined" error={error} margin="none" />
				)}
			/>
			{helperText && <FormHelperText className="mx-0">{helperText}</FormHelperText>}
		</FormControl>
	)
}

export default SfiSingleAutocomplete
