import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { SfiCountrySelect, SfiCountrySelectProps } from '@/components/inputs/sfi-country-select'
import { cn } from '@/utils/cn'

interface RfhSfiCountrySelectProps<T extends FieldValues> extends Omit<
	SfiCountrySelectProps,
	'value' | 'onChange' | 'error'
> {
	name: Path<T>
	control: Control<T>
	rules?: object
	fullWidth?: boolean
}

export function RfhSfiCountrySelect<T extends FieldValues>({
	name,
	control,
	rules,
	containerClassName,
	helperText,
	...props
}: RfhSfiCountrySelectProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error } }) => (
				<SfiCountrySelect
					{...props}
					value={field.value || ''}
					onChange={(value) => {
						field.onChange(value)
					}}
					error={!!error}
					helperText={error?.message || helperText}
					containerClassName={cn(containerClassName)}
					fullWidth={props.fullWidth}
					ref={field.ref}
				/>
			)}
		/>
	)
}

export default RfhSfiCountrySelect
