'use client'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export const useDevice = () => {
	const theme = useTheme()

	const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'), {
		noSsr: true,
	})
	const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true })

	const device: DeviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'

	return { device, isMobile, isTablet, isDesktop }
}
