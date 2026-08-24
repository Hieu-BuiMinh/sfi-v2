'use client'

import { useSfsSidebar } from './sidebar-provider'
import { cn } from '@/utils/cn'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useCallback } from 'react'
import { useSidebarBreakpoints } from './use-sidebar-breakpoints'

interface SidebarToggleButtonProps {
	className?: string
	collapseIcon?: React.ReactNode
	openIcon?: React.ReactNode
	ariaLabel?: string
}

export function SidebarToggleButton({
	className,
	collapseIcon,
	openIcon,
	ariaLabel = 'Toggle sidebar',
}: SidebarToggleButtonProps) {
	const { isMobile } = useSidebarBreakpoints()
	const { drawerOpen, setDrawerOpen, collapsed, setCollapsed } = useSfsSidebar()

	const onToggle = useCallback(() => {
		if (isMobile) setDrawerOpen((prev) => !prev)
		else setCollapsed((prev) => !prev)
	}, [isMobile, setDrawerOpen, setCollapsed])

	const isOpen = isMobile ? drawerOpen : !collapsed

	const defaultIcon = isMobile ? (
		<MenuIcon fontSize="small" />
	) : isOpen ? (
		<KeyboardDoubleArrowLeftIcon fontSize="small" />
	) : (
		<KeyboardDoubleArrowRightIcon fontSize="small" />
	)

	const icon = (isOpen ? collapseIcon : openIcon) ?? defaultIcon

	return (
		<button
			type="button"
			onClick={onToggle}
			aria-label={ariaLabel}
			aria-expanded={isMobile ? drawerOpen : !collapsed}
			className={cn('cursor-pointer', className)}
		>
			{icon}
		</button>
	)
}
