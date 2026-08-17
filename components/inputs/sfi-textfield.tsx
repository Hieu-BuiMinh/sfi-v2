/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { TextField as MuiTextField, TextFieldProps, styled } from '@mui/material'

export const StyledTextField = styled(MuiTextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		backgroundColor: 'var(--token-input-background)',
		'&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
			borderColor: 'var(--mui-palette-primary-main)',
		},
	},
}))

export const SfiTextField = React.forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
	return <StyledTextField margin="dense" fullWidth variant="outlined" {...props} ref={ref} />
})

SfiTextField.displayName = 'SfiTextField'

export default SfiTextField
