'use client'

import SfiLogo from '@/components/logos/sfi'
import { cn } from '@/utils/cn'
import { SidebarToggleButton, useSfsSidebar } from './sidebar-base'

export default function PortalSidebarHeader() {
	const { collapsed } = useSfsSidebar()

	return (
		<div className="flex items-center justify-between">
			<SfiLogo variant="short-negative" className={cn(collapsed ? 'hidden dark:block' : 'hidden')} />
			<SfiLogo variant="short-positive" className={cn(collapsed ? 'block dark:hidden' : 'hidden')} />
			<SfiLogo variant="full-negative" className={cn(!collapsed ? 'hidden dark:block' : 'hidden')} />
			<SfiLogo variant="full-positive" className={cn(!collapsed ? 'block dark:hidden' : 'hidden')} />
			<SidebarToggleButton
				openIcon={<ToggleArrow />}
				collapseIcon={<ToggleArrow />}
				className="border-token-border bg-mui-bg-paper absolute top-1/2 right-0 w-fit -translate-y-1/2 rounded-s-md border border-r-0 px-0.5 py-2"
			/>
		</div>
	)
}

function ToggleArrow() {
	return (
		<svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 4.93852L4.73951 9.67803L6.07402 8.34351L2.66908 4.93858L6.07387 1.53379L4.7393 0.199219L0 4.93852ZM14 4.93872L9.2605 0.199219L7.92598 1.53373L11.3309 4.93867L7.92613 8.34346L9.2607 9.67803L14 4.93872Z"
				className="fill-mui-primary dark:fill-mui-secondary"
			/>
		</svg>
	)
}
