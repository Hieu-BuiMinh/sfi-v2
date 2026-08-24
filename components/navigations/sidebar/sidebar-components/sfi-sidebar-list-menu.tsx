'use client'

import React from 'react'
import { cn } from '@/utils/cn'

export type SfiSidebarListMenuProps = {
	className?: string
	children?: React.ReactNode
}

export function SfiSidebarListMenu({ className, children }: SfiSidebarListMenuProps) {
	return <div className={cn('flex flex-col gap-2', className)}>{children}</div>
}
