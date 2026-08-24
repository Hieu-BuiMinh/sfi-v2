'use client'

import React, { createContext, useContext } from 'react'

export type SfiSidebarListCtx = {
	collapsed: boolean
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export const SfiSidebarListContext = createContext<SfiSidebarListCtx | null>(null)

export const useSfsSidebarListCtx = () => {
	const ctx = useContext(SfiSidebarListContext)
	if (!ctx) {
		throw new Error('SidebarListSfs.* must be used within <SidebarListSfs.Root />')
	}
	return ctx
}
