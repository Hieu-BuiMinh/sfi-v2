'use client'

import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { cn } from '@/utils/cn'
import { useSfsSidebarListCtx } from './sfi-sidebar-list-context'

export type SfiSidebarListActionProps = ButtonProps & {
	icon?: React.ReactNode
}

export function SfiSidebarListAction({ icon, className, ...props }: SfiSidebarListActionProps) {
	const { collapsed } = useSfsSidebarListCtx()
	if (collapsed) return null

	return (
		<Button
			variant="text"
			color="white"
			sx={{ minWidth: 40, borderRadius: 0 }}
			{...props}
			className={cn('shrink-0 px-2 py-2', className)}
		>
			{icon}
		</Button>
	)
}
