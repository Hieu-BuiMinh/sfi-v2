/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useSfsSidebar } from './sidebar-provider'
import { cn } from '@/utils/cn'
import { Drawer, type DrawerProps } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useSidebarBreakpoints } from './use-sidebar-breakpoints'

interface ISidebarProps {
	widths?: {
		desktop?: number
		tablet?: number
	}
	children: React.ReactNode
	className?: string
}

const SIDEBAR_WIDTH = 270
const SIDEBAR_COLLAPSED_WIDTH = 90

export default function SfiSidebarLayout({
	widths: { desktop = SIDEBAR_WIDTH, tablet = SIDEBAR_COLLAPSED_WIDTH } = {},
	children,
	className,
}: ISidebarProps) {
	const [loaded, setLoaded] = useState(false)

	const [width, setWidth] = useState(desktop)
	const [isResizing, setIsResizing] = useState(false)
	const tabletWidth = tablet
	const { isDesktop, isTablet, isMobile } = useSidebarBreakpoints()
	const { drawerOpen, setDrawerOpen, collapsed, setCollapsed } = useSfsSidebar()

	useEffect(() => {
		setWidth(desktop)
	}, [desktop])

	useEffect(() => {
		if (isDesktop || isMobile) setCollapsed(false)
		if (isTablet) setCollapsed(true)
	}, [isDesktop, isTablet, isMobile, setCollapsed])

	useEffect(() => {
		setLoaded(true)
	}, [])

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault()
		setIsResizing(true)
		const startX = e.clientX
		const startWidth = width

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const deltaX = moveEvent.clientX - startX
			const newWidth = Math.max(200, Math.min(500, startWidth + deltaX))
			setWidth(newWidth)
		}

		const handleMouseUp = () => {
			setIsResizing(false)
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	const drawerSx = useMemo<DrawerProps['sx']>(
		() => ({
			width: SIDEBAR_WIDTH,
			flexShrink: 0,
			'& .MuiDrawer-paper': {
				width: SIDEBAR_WIDTH,
				boxSizing: 'border-box',
			},
		}),
		[]
	)

	if (!loaded) return null

	if (isDesktop || isTablet) {
		return (
			<aside
				className={cn(
					'bg-token-bg-secondary sticky top-0 h-screen shrink-0 overflow-y-auto',
					!isResizing && 'transition-all duration-200',
					className
				)}
				style={{ width: collapsed ? tabletWidth : width }}
			>
				{children}
				{!collapsed && (
					<div
						onMouseDown={handleMouseDown}
						className="hover:bg-mui-primary/30 active:bg-mui-primary-alpha/50 absolute top-0 right-0 bottom-0 z-50 w-[4px] cursor-col-resize transition-colors"
					/>
				)}
			</aside>
		)
	}

	if (isMobile) {
		return (
			<Drawer
				sx={drawerSx}
				anchor="left"
				variant="temporary"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				ModalProps={{ keepMounted: true }}
			>
				{children}
			</Drawer>
		)
	}

	return null
}
