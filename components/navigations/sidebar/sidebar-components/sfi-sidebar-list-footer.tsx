'use client'

import React from 'react'
import { cn } from '@/utils/cn'

export type SfiSidebarListFooterProps = {
	className?: string
	children?: React.ReactNode
}

export function SfiSidebarListFooter({ className, children }: SfiSidebarListFooterProps) {
	return (
		<div className={cn('border-mui-divider bg-mui-bg-default shrink-0 border-t px-3 py-3', className)}>
			{children}
		</div>
	)
}
