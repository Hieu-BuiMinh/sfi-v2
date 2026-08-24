/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { usePathname } from 'next/navigation'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type SidebarContextValue = {
	drawerOpen: boolean
	setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>

	collapsed: boolean
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [collapsed, setCollapsed] = useState(false)

	const value = useMemo<SidebarContextValue>(
		() => ({ drawerOpen, setDrawerOpen, collapsed, setCollapsed }),
		[drawerOpen, collapsed]
	)

	useEffect(() => {
		setDrawerOpen(false)
	}, [pathname])

	return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSfsSidebar() {
	const ctx = useContext(SidebarContext)
	if (!ctx) throw new Error('useSfsSidebar must be used within SidebarProvider')
	return ctx
}
