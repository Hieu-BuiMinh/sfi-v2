/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuItemProps } from '@mui/material'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { SfiMultiSelect as Select } from '@/components/inputs/sfi-multi-select'
import { SfiOption } from '@/components/inputs/types'
import { ReactNode } from 'react'

interface RfhSfiMultiSelectProps<T extends FieldValues> {
	name: Path<T>
	control: Control<T>
	label?: string
	options?: SfiOption[]
	rules?: object
	helperText?: string
	containerClassName?: string
	className?: string
	sx?: any
	disabled?: boolean
	menuItemProps?: MenuItemProps
	size?: 'small' | 'medium' | 'large'
	children?: ReactNode
}

export function RfhSfiMultiSelect<T extends FieldValues>({
	name,
	control,
	label,
	options,
	rules,
	helperText,
	containerClassName,
	className,
	menuItemProps,
	size,
	children,
	...props
}: RfhSfiMultiSelectProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState: { error } }) => (
				<Select
					{...field}
					{...(props as any)}
					label={label}
					options={options}
					menuItemProps={menuItemProps}
					error={!!error}
					helperText={error?.message || helperText}
					containerClassName={containerClassName}
					className={className}
					size={size}
					id={name}
					value={field.value || []}
				>
					{children}
				</Select>
			)}
		/>
	)
}

export default RfhSfiMultiSelect
