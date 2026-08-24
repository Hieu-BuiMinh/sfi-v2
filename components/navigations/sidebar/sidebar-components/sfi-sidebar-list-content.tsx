'use client'

import React from 'react'
import { cn } from '@/utils/cn'

export type SfiSidebarListContentProps = {
	className?: string
	children?: React.ReactNode
}

export function SfiSidebarListContent({ className, children }: SfiSidebarListContentProps) {
	return (
		<div className={cn('bg-mui-bg-default flex-1 overflow-y-auto pt-1', className)}>
			<div className="flex flex-col gap-1.5">{children}</div>
		</div>
	)
}
