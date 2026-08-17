import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import {
  SfiDateRangePicker,
  DateRange,
  SfiDateRangePickerProps,
} from '@/components/inputs/sfi-date-range-picker'
import { cn } from '@/utils/cn'

interface RfhSfiDateRangePickerProps<T extends FieldValues> extends Omit<
  SfiDateRangePickerProps,
  'value' | 'onChange'
> {
  name: Path<T>
  control: Control<T>
  rules?: object
  containerClassName?: string
  helperText?: string
}

export function RfhSfiDateRangePicker<T extends FieldValues>({
  name,
  control,
  rules,
  containerClassName,
  helperText,
  ...props
}: RfhSfiDateRangePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className={cn(containerClassName)}>
          <SfiDateRangePicker
            {...props}
            value={field.value || { from: null, to: null }}
            onChange={(newValue: DateRange) => {
              field.onChange(newValue)
            }}
            error={!!error}
            helperText={error?.message || helperText}
          />
        </div>
      )}
    />
  )
}

export default RfhSfiDateRangePicker
