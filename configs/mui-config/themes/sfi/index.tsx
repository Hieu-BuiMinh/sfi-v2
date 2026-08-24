'use client'

import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
	interface Palette {
		white: Palette['primary']
	}
	interface PaletteOptions {
		white?: PaletteOptions['primary']
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		white: true
	}
}

declare module '@mui/material/InputBase' {
	interface InputBasePropsSizeOverrides {
		large: true
	}
}

declare module '@mui/material/TextField' {
	interface TextFieldPropsSizeOverrides {
		large: true
	}
}

declare module '@mui/material/FormControl' {
	interface FormControlPropsSizeOverrides {
		large: true
	}
}

declare module '@mui/material/InputLabel' {
	interface InputLabelPropsSizeOverrides {
		large: true
	}
}

declare module '@mui/material/Autocomplete' {
	interface AutocompletePropsSizeOverrides {
		large: true
	}
}

const controlSizes = {
	small: 32,
	medium: 38,
	large: 50,
}

export const sfiOnboardTheme = createTheme({
	cssVariables: {
		colorSchemeSelector: 'data-mui-color-scheme',
	},
	colorSchemes: {
		light: {
			palette: {
				white: {
					main: '#ffffff',
					contrastText: '#000000',
				},
				background: {
					default: '#ffffff',
					paper: '#ffffff',
				},
				text: {
					primary: '#000000',
					secondary: '#637381',
					disabled: 'rgba(0, 0, 0, 0.38)',
				},
				primary: {
					main: '#158084',
					light: '#1ba6ab',
					dark: '#0f595c',
					contrastText: '#ffffff',
				},
				secondary: {
					main: '#13C296',
					light: '#25e7b5',
					dark: '#0e9271',
					contrastText: '#ffffff',
				},
				error: {
					main: '#e7000b',
					light: 'rgb(235, 51, 59)',
					dark: 'rgb(161, 0, 7)',
					contrastText: '#fff',
				},
				warning: {
					main: '#ff9800',
					light: '#ffb74d',
					dark: '#f57c00',
					contrastText: 'rgba(0, 0, 0, 0.87)',
				},
				info: {
					main: '#2196f3',
					light: 'rgb(77, 171, 245)',
					dark: 'rgb(23, 105, 170)',
					contrastText: '#fff',
				},
				success: {
					main: '#4caf50',
					light: '#81c784',
					dark: '#388e3c',
					contrastText: 'rgba(0, 0, 0, 0.87)',
				},
				divider: 'rgba(0, 0, 0, 0.12)',
			},
		},
		dark: {
			palette: {
				white: {
					main: '#ffffff',
					contrastText: '#000000',
				},
				background: {
					default: '#111928',
					paper: '#1f2a37',
				},
				text: {
					primary: '#ffffff',
					secondary: '#bfbfc1',
					disabled: 'rgba(255, 255, 255, 0.5)',
				},
				primary: {
					main: '#13C296',
					light: '#25e7b5',
					dark: '#0e9271',
					contrastText: 'rgba(0, 0, 0, 0.87)',
				},
				secondary: {
					main: '#158084',
					light: '#1ba6ab',
					dark: '#0f595c',
					contrastText: '#fff',
				},
				error: {
					main: '#f87171',
					light: '#fca5a5',
					dark: '#ef4444',
					contrastText: '#fff',
				},
				warning: {
					main: '#ff9800',
					light: '#ffb74d',
					dark: '#f57c00',
					contrastText: 'rgba(0, 0, 0, 0.87)',
				},
				info: {
					main: '#2196f3',
					light: 'rgb(77, 171, 245)',
					dark: 'rgb(23, 105, 170)',
					contrastText: '#fff',
				},
				success: {
					main: '#4caf50',
					light: '#81c784',
					dark: '#388e3c',
					contrastText: 'rgba(0, 0, 0, 0.87)',
				},
				divider: 'rgba(255, 255, 255, 0.12)',
			},
		},
	},
	typography: {
		fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
	},
	spacing: 4,
	shape: { borderRadius: 6 },
	components: {
		MuiButtonBase: {
			defaultProps: {},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'capitalize',
					fontWeight: 600,
					fontSize: 14,
					boxShadow: 'none',
					'&:hover': { boxShadow: 'none' },
					'&:active': { boxShadow: 'none' },
					'&:focus': { boxShadow: 'none' },
				},
				sizeLarge: {
					height: controlSizes.large,
					padding: '12px 24px',
				},
				sizeMedium: {
					height: controlSizes.medium,
					padding: '8px 16px',
				},
				sizeSmall: {
					height: controlSizes.small,
					padding: '4px 12px',
				},
			},
			variants: [
				{
					props: { variant: 'contained' },
					style: { boxShadow: 'none' },
				},
				{
					props: { variant: 'contained', color: 'white' },
					style: {
						boxShadow: 'none',
						border: '1px solid var(--mui-palette-divider)',
					},
				},
			],
		},
		MuiList: {
			styleOverrides: {
				root: { padding: 8, display: 'flex', flexDirection: 'column', gap: 4 },
			},
			defaultProps: { dense: true },
		},
		MuiMenuItem: {
			styleOverrides: { root: { borderRadius: 6 } },
			defaultProps: { dense: true },
		},
		MuiTable: { defaultProps: { size: 'medium' } },
		MuiButtonGroup: { defaultProps: { size: 'medium' } },
		MuiCheckbox: { defaultProps: { size: 'medium' } },
		MuiFab: { defaultProps: { size: 'medium' } },
		MuiFormControl: { defaultProps: { margin: 'none', size: 'medium' } },
		MuiFormHelperText: {},
		MuiIconButton: { defaultProps: { size: 'medium' } },
		MuiInputBase: {
			defaultProps: {},
			styleOverrides: {
				root: {
					backgroundColor: 'var(--token-input-background)',
				},
			},
		},
		MuiOutlinedInput: {
			variants: [
				{
					props: { size: 'small' },
					style: {
						'&:not(.MuiInputBase-multiline):not(.MuiAutocomplete-inputRoot)': {
							height: controlSizes.small,
						},
						'& .MuiOutlinedInput-input': { padding: '4.5px 12px' },
					},
				},
				{
					props: { size: 'medium' },
					style: {
						'&:not(.MuiInputBase-multiline):not(.MuiAutocomplete-inputRoot)': {
							height: controlSizes.medium,
						},
						'& .MuiOutlinedInput-input': { padding: '7.5px 14px' },
					},
				},
				{
					props: { size: 'large' },
					style: {
						'&:not(.MuiInputBase-multiline):not(.MuiAutocomplete-inputRoot)': {
							height: controlSizes.large,
						},
						'& .MuiOutlinedInput-input': { padding: '13.5px 16px' },
					},
				},
			],
		},
		MuiAutocomplete: {
			defaultProps: { size: 'medium' },
			variants: [
				{
					props: { size: 'small' },
					style: { '& .MuiOutlinedInput-root': { minHeight: controlSizes.small } },
				},
				{
					props: { size: 'medium' },
					style: { '& .MuiOutlinedInput-root': { minHeight: controlSizes.medium } },
				},
				{
					props: { size: 'large' },
					style: { '& .MuiOutlinedInput-root': { minHeight: controlSizes.large } },
				},
			],
		},
		MuiInputLabel: {
			defaultProps: {},
			variants: [
				{
					props: { size: 'small' },
					style: {
						'&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
							transform: 'translate(14px, 5px) scale(1)',
						},
					},
				},
				{
					props: { size: 'medium' },
					style: {
						'&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
							transform: 'translate(14px, 8px) scale(1)',
						},
					},
				},
				{
					props: { size: 'large' },
					style: {
						'&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
							transform: 'translate(14px, 14px) scale(1)',
						},
					},
				},
			],
		},
		MuiRadio: { defaultProps: { size: 'medium' } },
		MuiSwitch: { defaultProps: { size: 'medium' } },
		MuiTextField: { defaultProps: { margin: 'none', size: 'medium' } },
	},
})

export default sfiOnboardTheme
