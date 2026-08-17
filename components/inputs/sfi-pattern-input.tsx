// https://s-yadav.github.io/react-number-format/docs/pattern_format

import React from 'react'
import { PatternFormat, PatternFormatProps } from 'react-number-format'
import { TextFieldProps } from '@mui/material'
import { StyledTextField } from './sfi-textfield'

export type SfiPatternInputProps = Omit<
  PatternFormatProps<TextFieldProps>,
  'customInput'
>

export const SfiPatternInput = React.forwardRef<
  HTMLInputElement,
  SfiPatternInputProps
>((props, ref) => {
  return (
    <PatternFormat
      fullWidth
      variant="outlined"
      {...props}
      getInputRef={ref}
      customInput={StyledTextField}
    />
  )
})

SfiPatternInput.displayName = 'SfiPatternInput'

export default SfiPatternInput
