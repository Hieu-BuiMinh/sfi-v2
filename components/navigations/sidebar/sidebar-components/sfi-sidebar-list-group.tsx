'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { useSfsSidebarListCtx } from './sfi-sidebar-list-context'

export type SfiSidebarListGroupProps = {
	title?: React.ReactNode
	right?: React.ReactNode
	className?: string
	children?: React.ReactNode
}

export function SfiSidebarListGroup({ title, right, className, children }: SfiSidebarListGroupProps) {
	const { collapsed } = useSfsSidebarListCtx()

	return (
		<section className={cn('flex flex-col gap-2', className)}>
			{(title || right) && !collapsed && (
				<div className="flex items-center justify-between px-2">
					{title && (
						<div className="line-clamp-1 font-semibold tracking-wide uppercase opacity-70">{title}</div>
					)}
					{right}
				</div>
			)}

			<div className="flex flex-col gap-2">{children}</div>
		</section>
	)
}
