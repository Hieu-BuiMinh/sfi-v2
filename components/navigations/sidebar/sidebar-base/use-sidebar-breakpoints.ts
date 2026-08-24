'use client'

import { useMediaQuery, useTheme } from '@mui/material'

export function useSidebarBreakpoints() {
	const theme = useTheme()
	const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return { isDesktop, isTablet, isMobile }
}
