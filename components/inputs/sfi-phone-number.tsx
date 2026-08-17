import { styled } from '@mui/material'
import { MuiTelInput, MuiTelInputProps } from 'mui-tel-input'

export type SfiPhoneNumberProps = Omit<MuiTelInputProps, 'forceCallingCode'>

const StyledMuiTelInput = styled(MuiTelInput)({
	'& .MuiOutlinedInput-root': {
		backgroundColor: 'var(--token-input-background)',
		'&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
			borderColor: 'var(--mui-palette-primary-main)',
		},
	},
})

export function SfiPhoneNumber(props: SfiPhoneNumberProps) {
	return <StyledMuiTelInput margin="dense" fullWidth variant="outlined" defaultCountry="ID" {...props} />
}

export default SfiPhoneNumber
