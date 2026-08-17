/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuItemProps } from '@mui/material'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { SfiSingleSelect as Select } from '@/components/inputs/sfi-single-select'
import { SfiOption } from '@/components/inputs/types'
import { ReactNode } from 'react'

interface RfhSfiSingleSelectProps<T extends FieldValues> {
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
	size?: 'small' | 'medium'
	children?: ReactNode
	fullWidth?: boolean
}

/**
 * Single-select Select wrapper for React Hook Form.
 */
export function RfhSfiSingleSelect<T extends FieldValues>({
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
}: RfhSfiSingleSelectProps<T>) {
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
					value={field.value || ''}
					fullWidth={props.fullWidth}
				>
					{children}
				</Select>
			)}
		/>
	)
}

export default RfhSfiSingleSelect
