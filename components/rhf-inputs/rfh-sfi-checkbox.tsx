import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { ReactNode } from 'react'
import { SfiCheckbox as Checkbox } from '@/components/inputs/sfi-checkbox'
import { SxProps, Theme } from '@mui/material'

interface RfhSfiCheckboxProps<T extends FieldValues> {
	name: Path<T>
	control: Control<T>
	label?: ReactNode
	rules?: object
	helperText?: string
	containerClassName?: string
	className?: string
	disabled?: boolean
	sx?: SxProps<Theme>
	onChange?: (checked: boolean) => void
}

export function RfhSfiCheckbox<T extends FieldValues>({
	name,
	control,
	label,
	rules,
	helperText,
	containerClassName,
	className,
	onChange: onChangeProp,
	...props
}: RfhSfiCheckboxProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
				<Checkbox
					{...field}
					{...props}
					label={label}
					checked={!!value}
					onChange={(e) => {
						onChange(e.target.checked)
						onChangeProp?.(e.target.checked)
					}}
					error={!!error}
					helperText={error?.message || helperText}
					containerClassName={containerClassName}
					className={className}
				/>
			)}
		/>
	)
}

export default RfhSfiCheckbox
