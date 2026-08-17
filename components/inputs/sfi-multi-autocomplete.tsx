/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
}

export function SfiMultiAutocomplete<
	T = SfiOption,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
>(props: SfiMultiAutocompleteProps<T, DisableClearable, FreeSolo>) {
	const { label, error, helperText, containerClassName, options = [], ...rest } = props

	return (
		<FormControl fullWidth error={error} className={cn('m-0 w-full', containerClassName)}>
			<StyledAutocomplete
				{...(rest as any)}
				options={options}
				multiple={true}
				getOptionLabel={
					props.getOptionLabel || ((option: any) => option?.label?.toString() || option?.value || '')
				}
				renderOption={
					props.renderOption || ((optProps: any, option: any) => <li {...optProps}>{option.label}</li>)
				}
				renderInput={(params) => (
					<TextField {...params} label={label as any} variant="outlined" error={error} />
				)}
			/>
			{helperText && <FormHelperText className="mx-0">{helperText}</FormHelperText>}
		</FormControl>
	)
}

export default SfiMultiAutocomplete
