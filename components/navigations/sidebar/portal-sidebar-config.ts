import type { ReactNode } from 'react'

export interface PortalSidebarItemConfig {
	label: string
	href?: string
	icon?: ReactNode
	activePattern?: RegExp
	divider?: boolean
	children?: PortalSidebarItemConfig[]
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function isPortalSidebarItemActive(item: PortalSidebarItemConfig, pathname: string): boolean {
	const portalPathname = pathname.replace(/^\/portal_sfi(?=\/|$)/, '') || '/'
	const pattern = item.activePattern ?? new RegExp(`^${escapeRegex(item.href || '')}/?$`)

	return (
		pattern.test(portalPathname) ||
		Boolean(item.children?.some((child) => isPortalSidebarItemActive(child, portalPathname)))
	)
}
