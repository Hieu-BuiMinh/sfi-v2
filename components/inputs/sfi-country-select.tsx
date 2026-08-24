/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Autocomplete, TextField, Box, styled, FormControl, FormHelperText } from '@mui/material'
import { cn } from '@/utils/cn'
import { countries } from '@/constants/country/country.const'

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		backgroundColor: 'var(--token-input-background)',
		'&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
			borderColor: 'var(--mui-palette-primary-main)',
		},
	},
})) as typeof Autocomplete

export interface CountryType {
	code: string
	label: string
	phone: string
	suggested?: boolean
}

export interface SfiCountrySelectProps {
	value?: string
	onChange?: (value: string) => void
	label?: string
	error?: boolean
	helperText?: React.ReactNode
	containerClassName?: string
	disabled?: boolean
	size?: 'small' | 'medium' | 'large'
	getCountryCode?: boolean
	hideCountryPhone?: boolean
	restrictedCountries?: string[]
	fullWidth?: boolean
}

export const SfiCountrySelect = React.forwardRef<HTMLDivElement, SfiCountrySelectProps>(
	(
		{
			value = '',
			onChange,
			label,
			error,
			helperText,
			containerClassName,
			disabled,
			size = 'medium',
			getCountryCode = false,
			hideCountryPhone = false,
			restrictedCountries,
			fullWidth = false,
			...props
		},
		ref
	) => {
		const filteredCountries =
			Array.isArray(countries) && restrictedCountries
				? countries.filter((c) => !restrictedCountries.includes(c.code))
				: Array.isArray(countries)
					? countries
					: []

		const selectedCountry =
			filteredCountries.find((c) =>
				getCountryCode ? c.code === value : c.label.toLowerCase() === value.toLowerCase()
			) || null

		return (
			<FormControl
				fullWidth={fullWidth}
				error={error}
				margin="none"
				size={size}
				className={cn(containerClassName)}
				ref={ref}
			>
				<StyledAutocomplete
					size={size}
					options={filteredCountries}
					autoHighlight
					value={selectedCountry}
					disabled={disabled}
					getOptionLabel={(option) => option.label}
					onChange={(event, newValue) => {
						const newCountryValue = newValue ? (getCountryCode ? newValue.code : newValue.label) : ''
						onChange?.(newCountryValue)
					}}
					isOptionEqualToValue={(option, value) =>
						getCountryCode ? option.code === value.code : option.label === value.label
					}
					renderOption={(renderProps, option) => {
						const { key, ...optionProps } = renderProps as any
						return (
							<Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
								<img
									loading="lazy"
									width="20"
									srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
									src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
									alt=""
								/>
								{option.label} ({option.code}){!hideCountryPhone ? ` +${option.phone}` : ''}
							</Box>
						)
					}}
					renderInput={(params) => {
						if ((params as any).inputProps) {
							;(params as any).inputProps.autoComplete = 'off'
						}
						return <TextField {...params} label={label} error={error} margin="none" size={size} />
					}}
				/>
				{helperText && <FormHelperText className="mx-0">{helperText}</FormHelperText>}
			</FormControl>
		)
	}
)

SfiCountrySelect.displayName = 'SfiCountrySelect'

export default SfiCountrySelect
