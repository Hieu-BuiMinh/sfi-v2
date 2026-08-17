/* eslint-disable @typescript-eslint/no-explicit-any */
import SfiRadioGroup, { SfiRadioGroupProps } from '@/components/inputs/sfi-radio-group'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface RfhSfiRadioGroupProps<T extends FieldValues> extends Omit<SfiRadioGroupProps, 'name' | 'value' | 'onChange'> {
	name: Path<T>
	control: Control<T>
	rules?: object
	onValueChange?: (value: string) => void
}

export function RfhSfiRadioGroup<T extends FieldValues>({
	name,
	control,
	rules,
	onValueChange,
	...props
}: RfhSfiRadioGroupProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error } }) => (
				<SfiRadioGroup
					{...field}
					{...props}
					error={!!error}
					helperText={error?.message || props.helperText}
					value={field.value || ''}
					onChange={(event, value) => {
						field.onChange(event)
						onValueChange?.(value)
					}}
					ref={field.ref as any}
				/>
			)}
		/>
	)
}

export default RfhSfiRadioGroup
