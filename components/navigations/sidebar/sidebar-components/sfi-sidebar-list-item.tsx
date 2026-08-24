'use client'

import React from 'react'
import { cn } from '@/utils/cn'

export type SfiSidebarListItemProps = {
	className?: string
	children?: React.ReactNode
}

export function SfiSidebarListItem({ className, children }: SfiSidebarListItemProps) {
	return <div className={cn('flex items-center gap-2', className)}>{children}</div>
}
