'use client'

import React, { useEffect, useState } from 'react'
import { TextFieldProps } from '@mui/material'
import { useDebounce } from '@uidotdev/usehooks'
import SfiTextField from './sfi-textfield'

export interface SfiDebounceTextFieldProps extends Omit<
  TextFieldProps,
  'onChange'
> {
  onDebounce: (value: string) => void
  debounceDelay?: number
  value?: string
}

export const SfiDebounceTextField = React.forwardRef<
  HTMLDivElement,
  SfiDebounceTextFieldProps
>(
  (
    { onDebounce, debounceDelay = 500, value: propValue = '', ...props },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(propValue)
    const debouncedValue = useDebounce(inputValue, debounceDelay)

    useEffect(() => {
      setInputValue(propValue)
    }, [propValue])

    useEffect(() => {
      onDebounce(debouncedValue)
    }, [debouncedValue, onDebounce])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
    }

    return (
      <SfiTextField
        {...props}
        value={inputValue}
        onChange={handleChange}
        ref={ref}
      />
    )
  }
)

SfiDebounceTextField.displayName = 'SfiDebounceTextField'

export default SfiDebounceTextField
