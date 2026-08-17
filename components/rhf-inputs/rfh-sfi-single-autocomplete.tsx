/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { SfiSingleAutocomplete as Autocomplete } from '@/components/inputs/sfi-single-autocomplete'
import { ReactNode } from 'react'
import { SfiOption as OptionType } from '@/components/inputs/types'

interface RfhSfiSingleAutocompleteProps<T extends FieldValues, Option = OptionType> {
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
	renderOption?: (props: object, option: Option) => ReactNode
	className?: string
	sx?: any
	loading?: boolean
	disabled?: boolean
	fullWidth?: boolean
	placeholder?: string
	onChange?: (value: any) => void
}

export function RfhSfiSingleAutocomplete<T extends FieldValues, Option = OptionType>({
	name,
	control,
	label,
	rules,
	helperText,
	containerClassName,
	inputClassName,
	options,
	...props
}: RfhSfiSingleAutocompleteProps<T, Option>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, value, ...field }, fieldState: { error } }) => {
				const selectedOption = options?.find((opt: any) => opt.value === value || opt === value) || null

				return (
					<Autocomplete
						{...(props as any)}
						{...(field as any)}
						options={options}
						value={selectedOption}
						onChange={(_: any, newValue: any) => {
							const val = newValue?.value ?? newValue
							onChange(val)
							props.onChange?.(val)
						}}
						label={label}
						error={!!error}
						helperText={error?.message || helperText}
						containerClassName={containerClassName}
						disabled={props.disabled}
						placeholder={props.placeholder}
						fullWidth={props.fullWidth}
					/>
				)
			}}
		/>
	)
}

export default RfhSfiSingleAutocomplete
