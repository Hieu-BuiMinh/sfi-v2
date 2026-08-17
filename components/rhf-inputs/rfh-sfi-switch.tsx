/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { ReactNode } from 'react'
import { SfiSwitch as Switch } from '@/components/inputs/sfi-switch'

interface RfhSfiSwitchProps<T extends FieldValues> {
	name: Path<T>
	control: Control<T>
	label?: ReactNode
	rules?: object
	helperText?: string
	containerClassName?: string
	className?: string
	sx?: any
}

export function RfhSfiSwitch<T extends FieldValues>({
	name,
	control,
	label,
	rules,
	helperText,
	containerClassName,
	className,
	...props
}: RfhSfiSwitchProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { value, ...field }, fieldState: { error } }) => (
				<Switch
					{...field}
					{...props}
					label={label}
					checked={!!value}
					error={!!error}
					helperText={error?.message || helperText}
					containerClassName={containerClassName}
					className={className}
				/>
			)}
		/>
	)
}

export default RfhSfiSwitch
