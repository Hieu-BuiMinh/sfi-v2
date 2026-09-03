/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import {
	SfiMultiAutocomplete as Autocomplete,
	SfiMultiAutocompleteProps,
} from '@/components/inputs/sfi-multi-autocomplete'
import { AutocompleteRenderOptionState } from '@mui/material'
import { HTMLAttributes, Key, ReactNode } from 'react'
import { SfiOption as OptionType } from '@/components/inputs/types'

interface RfhSfiMultiAutocompleteProps<T extends FieldValues, Option = OptionType> {
	name: Path<T>
	control: Control<T>
	label?: string
	rules?: object
	helperText?: string
	containerClassName?: string
	inputClassName?: string
	options: Option[]
	disableClearable?: boolean
	freeSolo?: boolean
	getOptionLabel?: (option: Option) => string
	renderOption?: (
		props: HTMLAttributes<HTMLLIElement> & { key: Key },
		option: Option,
		state: AutocompleteRenderOptionState
	) => ReactNode
	className?: string
	sx?: any
	loading?: boolean
	disabled?: boolean
	disableCloseOnSelect?: boolean
	size?: 'small' | 'medium' | 'large'
	placeholder?: string
	onChange?: (values: any[]) => void
	slotProps?: SfiMultiAutocompleteProps<Option>['slotProps']
}

/**
 * Multi-select Autocomplete wrapper for React Hook Form.
 * Form value is stored as string[] (array of option.value), but component displays the full option objects.
 */
export function RfhSfiMultiAutocomplete<T extends FieldValues, Option = OptionType>({
	name,
	control,
	label,
	rules,
	helperText,
	containerClassName,
	inputClassName,
	options,
	...props
}: RfhSfiMultiAutocompleteProps<T, Option>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, value, ...field }, fieldState: { error } }) => {
				const selectedOptions = Array.isArray(value)
					? value
							.map((val: any) => options?.find((opt: any) => opt.value === val || opt === val))
							.filter(Boolean)
					: []

				return (
					<Autocomplete
						{...(props as any)}
						{...(field as any)}
						options={options}
						value={selectedOptions}
						onChange={(_: any, newValue: any) => {
							const vals = Array.isArray(newValue) ? newValue.map((v: any) => v?.value ?? v) : []
							onChange(vals)
							props.onChange?.(vals)
						}}
						label={label}
						error={!!error}
						helperText={error?.message || helperText}
						containerClassName={containerClassName}
						disabled={props.disabled}
						placeholder={props.placeholder}
						slotProps={{
							...props.slotProps,
							chip: {
								variant: 'filled',
								color: 'primary',
								size: 'small',
								...(props.slotProps?.chip as object),
							},
						}}
					/>
				)
			}}
		/>
	)
}

export default RfhSfiMultiAutocomplete
