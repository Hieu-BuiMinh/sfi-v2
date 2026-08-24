'use client'

import React, { useState } from 'react'
import { Button, Collapse, Tooltip } from '@mui/material'
import { cn } from '@/utils/cn'
import { useSfsSidebarListCtx } from './sfi-sidebar-list-context'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'

export type SfiCollapsibleGroupProps = {
	title?: React.ReactNode
	icon?: React.ReactNode
	defaultOpen?: boolean
	open?: boolean
	onOpenChange?: (open: boolean) => void
	isActive?: boolean
	right?: React.ReactNode
	className?: string
	children?: React.ReactNode
}

export function SfiSidebarListCollapsible({
	title,
	icon,
	defaultOpen = true,
	open: openControlled,
	onOpenChange,
	isActive,
	right,
	className,
	children,
}: SfiCollapsibleGroupProps) {
	const { collapsed } = useSfsSidebarListCtx()
	const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen)

	const isControlled = typeof openControlled === 'boolean'
	const open = isControlled ? openControlled : openUncontrolled

	const setOpen = (next: boolean) => {
		if (!isControlled) setOpenUncontrolled(next)
		onOpenChange?.(next)
	}

	const showContent = !collapsed && open

	return (
		<section className={cn('flex flex-col', className)}>
			<SfiCollapsibleTrigger
				title={title}
				icon={icon}
				right={right}
				open={open}
				isActive={isActive}
				onToggle={() => setOpen(!open)}
				setOpen={setOpen}
			/>

			<SfiCollapsibleContent open={showContent}>
				<div className="flex flex-col gap-2">{children}</div>
			</SfiCollapsibleContent>
		</section>
	)
}

function SfiCollapsibleTrigger({
	title,
	icon,
	right,
	open,
	isActive,
	onToggle,
	setOpen,
}: {
	title?: React.ReactNode
	icon?: React.ReactNode
	right?: React.ReactNode
	open: boolean
	isActive?: boolean
	onToggle: () => void
	setOpen: (next: boolean) => void
}) {
	const { collapsed, setCollapsed } = useSfsSidebarListCtx()

	const button = (
		<Button
			variant="text"
			// color="white"
			sx={{ borderRadius: 0 }}
			onClick={() => {
				onToggle()
				if (collapsed) {
					setCollapsed(false)
					setOpen(true)
				}
			}}
			className={cn(
				'text-token-muted-foreground! h-10.25 w-full justify-start gap-3 rounded-lg px-2.5 py-1.5 normal-case',
				isActive &&
					'bg-mui-primary/10! text-mui-primary! hover:bg-mui-primary/15! dark:bg-mui-secondary/10! dark:text-mui-secondary! dark:hover:bg-mui-secondary/15!',
				open && !collapsed && !isActive && 'bg-black/5! dark:bg-white/5!',
				collapsed && 'items-center justify-center'
			)}
		>
			{icon && <span className="shrink-0">{icon}</span>}

			{!collapsed && (
				<span className="min-w-0 flex-1">
					<span className="line-clamp-1 block truncate text-left text-sm font-semibold">{title}</span>
				</span>
			)}

			{!collapsed && (
				<span className="flex shrink-0 items-center gap-2 opacity-70">
					{right}
					<span className={cn('transition-transform duration-150', open ? 'rotate-90' : 'rotate-0')}>
						{/* ▶ or icon */}
						<KeyboardArrowRightRoundedIcon />
					</span>
				</span>
			)}
		</Button>
	)

	if (collapsed && title) {
		return (
			<Tooltip title={title} placement="right" arrow>
				{button}
			</Tooltip>
		)
	}

	return button
}

function SfiCollapsibleContent({ open, children }: { open: boolean; children?: React.ReactNode }) {
	return (
		<Collapse in={open} timeout="auto" unmountOnExit>
			<div>{children}</div>
		</Collapse>
	)
}
