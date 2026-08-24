'use client'

import { cn } from '@/utils/cn'
import Link from 'next/link'
import SidebarListSfs from './sidebar-components'
import { PortalSidebarItemConfig } from './portal-sidebar-config'

interface PortalSidebarItemProps {
	item: PortalSidebarItemConfig
	isActive: (item: PortalSidebarItemConfig) => boolean
	isChild?: boolean
}

export default function PortalSidebarItem({ item, isActive, isChild = false }: PortalSidebarItemProps) {
	const active = isActive(item)

	if (item.children?.length) {
		return (
			<SidebarListSfs.CollapsibleGroup
				title={item.label}
				icon={item.icon}
				isActive={active}
				defaultOpen={active}
				className="px-0"
			>
				{item.children.map((child) => (
					<PortalSidebarItem key={child.label} item={child} isActive={isActive} isChild />
				))}
			</SidebarListSfs.CollapsibleGroup>
		)
	}

	return (
		<SidebarListSfs.Menu className="relative gap-0">
			<SidebarListSfs.MenuItem className="relative h-10.25">
				<SidebarListSfs.MenuButton
					label={item.label}
					icon={item.icon}
					isActive={active}
					className={cn('size-full', isChild && 'pl-4')}
					{...(item.href && { component: Link, href: item.href })}
				/>
			</SidebarListSfs.MenuItem>
		</SidebarListSfs.Menu>
	)
}
