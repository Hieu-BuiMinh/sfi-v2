import { SfiPhoneNumber, SfiPhoneNumberProps } from '@/components/inputs/sfi-phone-number'
import { cn } from '@/utils/cn'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface RhfPhoneInputProps<T extends FieldValues> extends Omit<SfiPhoneNumberProps, 'name'> {
	name: Path<T>
	control: Control<T>
	rules?: object
	containerClassName?: string
}

export function RhfPhoneInput<T extends FieldValues>({
	name,
	control,
	rules,
	containerClassName,
	...props
}: RhfPhoneInputProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error } }) => (
				<SfiPhoneNumber
					{...props}
					name={field.name}
					value={field.value as string}
					onChange={field.onChange}
					onBlur={field.onBlur}
					inputRef={field.ref}
					error={!!error}
					helperText={error?.message || props.helperText}
					className={cn(containerClassName, props.className)}
				/>
			)}
		/>
	)
}

export default RhfPhoneInput
