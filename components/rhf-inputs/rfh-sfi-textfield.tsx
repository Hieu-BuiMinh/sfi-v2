import { TextFieldProps } from '@mui/material'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { SfiTextField as TextField } from '@/components/inputs/sfi-textfield'
import { cn } from '@/utils/cn'

interface RfhSfiTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
	name: Path<T>
	control: Control<T>
	rules?: object
	containerClassName?: string
}

export function RfhSfiTextField<T extends FieldValues>({
	name,
	control,
	rules,
	containerClassName,
	...props
}: RfhSfiTextFieldProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error } }) => (
			<TextField
				{...field}
				{...props}
				value={field.value ?? ''}
				error={!!error}
					helperText={error?.message || props.helperText}
					className={cn(containerClassName, props.className)}
					ref={field.ref}
				/>
			)}
		/>
	)
}

export default RfhSfiTextField
