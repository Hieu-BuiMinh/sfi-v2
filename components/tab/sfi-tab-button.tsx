/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { ReactNode, useState } from 'react'
import { Button, ButtonProps } from '@mui/material'
import { cn } from '@/utils/cn'

export interface SfiTabButtonItem {
	key: string
	label: ReactNode
	content: ReactNode
	disabled?: boolean
	buttonProps?: ButtonProps
}

interface SfiTabButtonProps {
	items: SfiTabButtonItem[]
	value?: string
	onChange?: (key: string) => void
	defaultKey?: string
	buttonProps?: ButtonProps
	activeButtonProps?: ButtonProps
	tabsClassName?: string
	className?: string
}

function SfiTabButton({
	items,
	value,
	onChange,
	defaultKey,
	buttonProps,
	activeButtonProps,
	tabsClassName,
	className,
}: SfiTabButtonProps) {
	const [activeInternalKey, setActiveInternalKey] = useState<string>(defaultKey ?? items[0]?.key ?? '')

	const isControlled = value !== undefined
	const activeKey = isControlled ? value : activeInternalKey
	const activeItem = items.find((item) => item.key === activeKey)

	return (
		<div className={className}>
			<div className={tabsClassName ?? 'flex gap-2'}>
				{items.map((item) => {
					const isActive = item.key === activeKey
					const { className: globalClass, ...restGlobalProps } = buttonProps ?? {}
					const { className: activeClass, ...restActiveProps } = activeButtonProps ?? {}
					const { className: itemClass, onClick: itemOnClick, ...restItemProps } = item.buttonProps ?? {}

					return (
						<Button
							key={item.key}
							disabled={item.disabled}
							{...restGlobalProps}
							{...(isActive ? restActiveProps : {})}
							{...restItemProps}
							className={cn(
								globalClass,
								isActive ? activeClass : '',
								itemClass,
								'dark:text-mui-primary rounded-md dark:bg-[#111928]'
							)}
							disableRipple
							sx={{
								...(restGlobalProps as any)?.sx,
								...(isActive ? (restActiveProps as any)?.sx : {}),
								...(restItemProps as any)?.sx,
								'@media (prefers-color-scheme: dark)': {},
								...(isActive && {
									color: '#fff',
									backgroundColor: 'var(--mui-palette-primary-main)',
									'&:hover': {
										backgroundColor: 'var(--mui-palette-primary-main)',
										opacity: 0.95,
									},
								}),
								'[data-mui-color-scheme="dark"] &': {
									border: 'none',
									color: 'var(--mui-palette-text-secondary)',
									backgroundColor: '#11192880',
									...(isActive && {
										color: 'var(--mui-palette-primary-main)',
										backgroundColor: '#111928',
									}),
									'&:hover': {
										backgroundColor: '#111928',
										opacity: 0.75,
									},
								},
							}}
							onClick={(e) => {
								setActiveInternalKey(item.key)
								onChange?.(item.key)
								itemOnClick?.(e)
							}}
						>
							{item.label}
						</Button>
					)
				})}
			</div>

			<div className="mt-4">{activeItem?.content}</div>
		</div>
	)
}

export default SfiTabButton

/*
 * ─── USAGE EXAMPLE ───────────────────────────────────────────────────────────
 *
 * import SfiTabButton, { SfiTabButtonItem } from '@/components/refactored/tab/sfi/sfi-tab-button'
 *
 * const TABS: SfiTabButtonItem[] = [
 *   { key: 'info', label: 'Info', content: <div>Info content</div> },
 *   { key: 'docs', label: 'Documents', content: <div>Docs content</div> },
 *   { key: 'history', label: 'History', content: <div>History</div>, disabled: true },
 * ]
 *
 * // Basic — unstyled, add your own classes
 * <SfiTabButton items={TABS} />
 *
 * // Global button style + active override
 * <SfiTabButton
 *   items={TABS}
 *   buttonProps={{ className: 'px-4 py-2 rounded border text-sm' }}
 *   activeButtonProps={{ className: 'bg-primary text-white border-primary' }}
 * />
 *
 * // Per-tab button style
 * const TABS: SfiTabButtonItem[] = [
 *   { key: 'info', label: 'Info', content: <div />, buttonProps: { className: 'text-blue-500' } },
 * ]
 *
 * ─── PROPS ─────────────────────────────────────────────────────────────────────
 * items              SfiTabButtonItem[]               Tab items (required)
 * defaultKey         string                            Active tab on mount
 * buttonProps        ButtonHTMLAttributes              Applied to all buttons
 * activeButtonProps  ButtonHTMLAttributes              Applied to active button (merged)
 * tabsClassName      string                            Buttons row wrapper className
 * className          string                            Root wrapper className
 *
 * SfiTabButtonItem:
 *   key          string                   Unique identifier
 *   label        ReactNode                Button label
 *   content      ReactNode                Panel content
 *   disabled     boolean                  Disable the button
 *   buttonProps  ButtonHTMLAttributes     Per-button overrides
 * ──────────────────────────────────────────────────────────────────────────────
 */
