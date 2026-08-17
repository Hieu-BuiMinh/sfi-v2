/* eslint-disable @typescript-eslint/no-explicit-any */
// https://s-yadav.github.io/react-number-format/docs/intro

import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { SfiNumberInput, BaseNumericProps, BasePatternProps } from '@/components/inputs/sfi-number-input'
import { TCurrency } from '@/utils/money'
import { cn } from '@/utils/cn'

type RfhSfiNumberInputProps<T extends FieldValues> = (
	(BaseNumericProps & { format?: never }) | (BasePatternProps & { format: string })
) & {
	name: Path<T>
	control: Control<T>
	rules?: object
	helperText?: string
	containerClassName?: string
	currency?: TCurrency
	digits?: number
}

export function RfhSfiNumberInput<T extends FieldValues>({
	name,
	control,
	rules,
	helperText,
	containerClassName,
	...props
}: RfhSfiNumberInputProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
				<SfiNumberInput
					{...field}
					{...props}
					error={!!error}
					helperText={error?.message || helperText}
					className={cn(containerClassName, props.className)}
					value={value ?? ''}
					onValueChange={(values: any) => {
						// Return floatValue (number) to form state
						onChange(values.floatValue)
					}}
					ref={field.ref}
				/>
			)}
		/>
	)
}

export default RfhSfiNumberInput
