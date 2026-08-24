/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import React, { useEffect, useState } from 'react'
import { DarkMode } from '@mui/icons-material'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { IconButton, useColorScheme } from '@mui/material'

export function ModeToggle() {
	const { mode, setMode } = useColorScheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<IconButton size="small" className="shrink-0 opacity-0" aria-label="Toggle color mode">
				<DarkMode fontSize="small" className="text-token-muted-foreground dark:text-mui-text-primary" />
			</IconButton>
		)
	}

	const isLight = mode === 'light'
	const nextMode = isLight ? 'dark' : 'light'

	return (
		<IconButton
			size="small"
			aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
			onClick={() => setMode(nextMode)}
			className="shrink-0"
		>
			{isLight ? <DarkMode fontSize="small" /> : <Brightness7Icon fontSize="small" />}
		</IconButton>
	)
}

export default ModeToggle
