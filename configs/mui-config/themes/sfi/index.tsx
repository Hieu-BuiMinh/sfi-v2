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
					height: 50,
					padding: '12px 24px',
				},
				sizeMedium: {
					height: 38,
					padding: '8px 16px',
				},
				sizeSmall: {
					height: 32,
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
		MuiFormControl: { defaultProps: { margin: 'dense', size: 'medium' } },
		MuiFormHelperText: { defaultProps: { margin: 'dense' } },
		MuiIconButton: { defaultProps: { size: 'medium' } },
		MuiInputBase: {
			defaultProps: { margin: 'dense' },
			styleOverrides: {
				root: {
					backgroundColor: 'var(--token-input-background)',
				},
			},
		},
		MuiInputLabel: { defaultProps: { margin: 'dense' } },
		MuiRadio: { defaultProps: { size: 'medium' } },
		MuiSwitch: { defaultProps: { size: 'medium' } },
		MuiTextField: { defaultProps: { margin: 'dense' } },
	},
})

export default sfiOnboardTheme
