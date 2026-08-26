import { SfiDatePicker, SfiDatePickerProps } from '@/components/inputs/sfi-date-picker'
import { cn } from '@/utils/cn'
import dayjs from 'dayjs'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface RfhSfiDatePickerProps<T extends FieldValues> extends Omit<SfiDatePickerProps, 'value' | 'onChange'> {
	name: Path<T>
	control: Control<T>
	rules?: object
	fullWidth?: boolean
	containerClassName?: string
	helperText?: string
}

export function RfhSfiDatePicker<T extends FieldValues>({
	name,
	control,
	rules,
	containerClassName,
	helperText,
	...props
}: RfhSfiDatePickerProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error } }) => (
				<SfiDatePicker
					{...props}
					value={field.value ? dayjs(field.value) : null}
					onChange={(newValue) => {
						if (newValue?.isValid()) {
							field.onChange(newValue ? newValue?.toISOString() : null)
						}
					}}
					containerClassName={cn(containerClassName, props.className)}
					slotProps={{
						...props.slotProps,
						textField: {
							...props.slotProps?.textField,
							error: !!error,
							helperText: error?.message || helperText,
							fullWidth: props.fullWidth ?? true,
							ref: field.ref,
						},
					}}
				/>
			)}
		/>
	)
}

export default RfhSfiDatePicker
