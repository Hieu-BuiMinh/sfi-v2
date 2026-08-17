'use client'

import React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider, Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { themesRegistry, sfiOnboardTheme } from '@/configs/mui-config/themes'

export interface MuiProviderProps {
	children: React.ReactNode
	theme?: Theme
	themeName?: string
}

export function MuiProvider({ children, theme, themeName }: MuiProviderProps) {
	const activeTheme = theme || (themeName && themesRegistry[themeName]) || sfiOnboardTheme

	return (
		<AppRouterCacheProvider options={{ key: 'css' }}>
			<ThemeProvider theme={activeTheme} defaultMode="light">
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppRouterCacheProvider>
	)
}

export default MuiProvider
