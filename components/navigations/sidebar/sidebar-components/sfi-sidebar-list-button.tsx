'use client'

import { cn } from '@/utils/cn'
import { Button, ButtonProps, Tooltip } from '@mui/material'
import React from 'react'
import { useSfsSidebarListCtx } from './sfi-sidebar-list-context'

export type SfiSidebarListButtonProps = {
	icon?: React.ReactNode
	label?: React.ReactNode
	isActive?: boolean
	endAdornment?: React.ReactNode
} & ButtonProps

export function SfiSidebarListButton({
	icon,
	label,
	isActive,
	endAdornment,
	className,
	...props
}: SfiSidebarListButtonProps) {
	const { collapsed } = useSfsSidebarListCtx()

	const button = (
		<Button
			variant="text"
			sx={{ borderRadius: 0 }}
			{...props}
			className={cn(
				'text-token-muted-foreground! relative w-full flex-1 justify-start gap-3 rounded-lg px-2.5 py-1.5 normal-case',
				isActive && 'bg-mui-primary/10! text-mui-primary! hover:bg-mui-primary/15!',
				collapsed && 'items-center justify-center',
				className
			)}
		>
			{icon ? (
				<span className={cn('shrink-0')}>{icon}</span>
			) : (
				<span className="flex size-6 shrink-0 items-center justify-center">
					<span className="bg-mui-primary dark:bg-mui-secondary size-2 rounded-full" />
				</span>
			)}

			{!collapsed && (
				<span className="min-w-0 flex-1">
					<span className="line-clamp-1 block truncate text-left text-sm font-semibold">{label}</span>
				</span>
			)}

			{!collapsed && endAdornment && <span className="shrink-0">{endAdornment}</span>}

			{isActive && <span className="bg-mui-primary absolute top-0 right-0 h-full w-1" />}
		</Button>
	)

	if (collapsed && label) {
		return (
			<Tooltip title={label} placement="right" arrow>
				{button}
			</Tooltip>
		)
	}

	return button
}
