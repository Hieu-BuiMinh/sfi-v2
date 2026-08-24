'use client'

import { useSfsSidebar } from '../sidebar-base/sidebar-provider'
import { cn } from '@/utils/cn'
import React from 'react'

export type SfiSidebarListHeaderProps = {
	className?: string
	children?: React.ReactNode
}

export function SfiSidebarListHeader({ className, children }: SfiSidebarListHeaderProps) {
	const { collapsed } = useSfsSidebar()

	return (
		<div
			className={cn(
				'border-mui-divider bg-mui-bg-default flex h-14 shrink-0 items-center border-b px-3 py-3',
				collapsed ? 'justify-center' : 'justify-start',
				className
			)}
		>
			{children}
		</div>
	)
}
