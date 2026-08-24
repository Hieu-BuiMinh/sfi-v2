'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { useSfsSidebarListCtx } from './sfi-sidebar-list-context'

export type SfiSidebarListDividerProps = {
	className?: string
}

export function SfiSidebarListDivider({ className }: SfiSidebarListDividerProps) {
	const { collapsed } = useSfsSidebarListCtx()
	if (collapsed) return null
	return <div className={cn('bg-mui-divider h-px', className)} />
}
