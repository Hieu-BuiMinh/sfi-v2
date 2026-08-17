/* eslint-disable @typescript-eslint/no-explicit-any */
// https://s-yadav.github.io/react-number-format/docs/pattern_format

import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import {
	SfiNumberInput as SfiPatternInput,
	BasePatternProps as SfiPatternInputProps,
} from '@/components/inputs/sfi-number-input'
import { cn } from '@/utils/cn'

type RfhSfiPatternInputProps<T extends FieldValues> = SfiPatternInputProps & {
	name: Path<T>
	control: Control<T>
	rules?: object
	helperText?: string
	containerClassName?: string
}

export function RfhSfiPatternInput<T extends FieldValues>({
	name,
	control,
	rules,
	helperText,
	containerClassName,
	...props
}: RfhSfiPatternInputProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
				<SfiPatternInput
					{...field}
					{...props}
					error={!!error}
					helperText={error?.message || helperText}
					className={cn(containerClassName, props.className)}
					value={value ?? ''}
					onValueChange={(values: any) => {
						// Return formattedValue (string) to form state
						onChange(values.formattedValue)
					}}
					ref={field.ref}
				/>
			)}
		/>
	)
}

export default RfhSfiPatternInput
