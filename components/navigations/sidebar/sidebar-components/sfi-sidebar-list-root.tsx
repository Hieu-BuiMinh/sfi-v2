'use client'

import React from 'react'
import { useSfsSidebar } from '../sidebar-base/sidebar-provider'
import { cn } from '@/utils/cn'
import { SfiSidebarListContext } from './sfi-sidebar-list-context'

export type SfiSidebarListRootProps = {
	className?: string
	children?: React.ReactNode
}

export function SfiSidebarListRoot({ className, children }: SfiSidebarListRootProps) {
	const { collapsed, setCollapsed } = useSfsSidebar()

	return (
		<SfiSidebarListContext.Provider value={{ collapsed, setCollapsed }}>
			<div className={cn('flex h-full flex-col', className)}>{children}</div>
		</SfiSidebarListContext.Provider>
	)
}
