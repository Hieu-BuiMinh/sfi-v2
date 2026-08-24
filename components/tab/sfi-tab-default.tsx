/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { ReactNode, useState } from 'react'
import { Box, Tab, TabProps, Tabs, TabsProps } from '@mui/material'
import { cn } from '@/utils/cn'

export interface SfiTabItem {
	key: string
	label: ReactNode
	content: ReactNode
	disabled?: boolean
	icon?: ReactNode
}

interface SfiTabsProps {
	items: SfiTabItem[]
	value?: string
	onChange?: (value: string) => void
	defaultKey?: string
	tabsProps?: Omit<TabsProps, 'value' | 'onChange'>
	tabProps?: Omit<TabProps, 'value' | 'onChange'>
	className?: string
	endAdornment?: ReactNode
}

function SfiTabs({ items, value, onChange, defaultKey, tabsProps, tabProps, className, endAdornment }: SfiTabsProps) {
	const [internalKey, setInternalKey] = useState<string>(defaultKey ?? items[0]?.key ?? '')

	const activeKey = value !== undefined ? value : internalKey

	const handleChange = (_: React.SyntheticEvent, newValue: string) => {
		if (value === undefined) {
			setInternalKey(newValue)
		}
		onChange?.(newValue)
	}

	const activeItem = items.find((item) => item.key === activeKey)

	return (
		<div className={cn('w-full overflow-hidden', className)}>
			<Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
				<Box sx={{ minWidth: 0, flex: 1 }}>
					<Tabs
						value={activeKey}
						onChange={handleChange}
						variant="scrollable"
						scrollButtons="auto"
						allowScrollButtonsMobile
						sx={{
							maxWidth: '100%',
							'& .MuiTabs-scroller': {
								overflow: 'auto !important',
							},
						}}
						{...tabsProps}
					>
						{items.map((item) => {
							const { sx: customTabSx, ...restTabProps } = tabProps || {}
							return (
								<Tab
									key={item.key}
									value={item.key}
									label={item.label}
									disabled={item.disabled}
									icon={item.icon as any}
									iconPosition="start"
									className={cn('capitalize', tabProps?.className)}
									sx={{
										minHeight: '48px',
										minWidth: '120px',
										textTransform: 'none',
										fontWeight: 600,
										fontSize: '14px',
										color: 'mui.text-secondary',
										'&.Mui-selected': {
											color: 'mui.primary',
											bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.08)',
											borderRadius: '0',
											'[data-mui-color-scheme="dark"] &': {
												bgcolor: '#111928',
											},
										},
										...customTabSx,
									}}
									{...restTabProps}
								/>
							)
						})}
					</Tabs>
				</Box>
				{endAdornment && <Box sx={{ flexShrink: 0, px: 1.5 }}>{endAdornment}</Box>}
			</Box>

			<div className="mt-4">{activeItem?.content}</div>
		</div>
	)
}

export default SfiTabs

/*

 import SfiTabs, { SfiTabItem } from '@/components/refactored/tab/sfi'

 const TABS: SfiTabItem[] = [
   { key: 'info', label: 'Info', content: <div>Info content</div> },
   { key: 'documents', label: 'Documents', content: <div>Documents content</div> },
   { key: 'history', label: 'History', content: <div>History content</div>, disabled: true },
 ]

 // Basic
 <SfiTabs items={TABS} />

 // With default active tab
 <SfiTabs items={TABS} defaultKey="documents" />

 // With MUI Tabs overrides
 <SfiTabs items={TABS} tabsProps={{ variant: 'fullWidth' }} />

 ─── PROPS ───────────────────────────────────────────────────────────────────
 items       SfiTabItem[]   List of tab items (required)
 defaultKey  string          Active tab on mount (defaults to first item)
 tabsProps   TabsProps       MUI Tabs props override
 className   string          Wrapper className
 ─────────────────────────────────────────────────────────────────────────────
 */
