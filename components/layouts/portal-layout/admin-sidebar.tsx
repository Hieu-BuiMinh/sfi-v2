'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { SfiAdminSidebarOutlinedIcon } from '@/components/icons/sidebar/admin-sidebar-icon-outlined'
import { SfiSidebarLayout, SidebarListSfs } from '@/components/navigations/sidebar'
import PortalSidebarHeader from '@/components/navigations/sidebar/portal-sidebar-header'
import PortalSidebarItem from '@/components/navigations/sidebar/portal-sidebar-item'
import {
	isPortalSidebarItemActive,
	PortalSidebarItemConfig,
} from '@/components/navigations/sidebar/portal-sidebar-config'

function SfiAdminSidebar() {
	const pathname = usePathname()

	const adminSidebarItems: PortalSidebarItemConfig[] = [
		{
			label: 'Dashboard',
			href: '/dashboard',
			icon: <SfiAdminSidebarOutlinedIcon.Dashboard className="size-5" />,
			activePattern: /^\/dashboard\/?$/,
		},
		{
			label: 'Application',
			href: '/applications',
			icon: <SfiAdminSidebarOutlinedIcon.AccountApplications className="size-5" />,
			activePattern: /^\/applications(\/.*)?$/,
		},
		{
			label: 'Customer List',
			href: '/customers',
			icon: <SfiAdminSidebarOutlinedIcon.Profiles className="size-5" />,
			activePattern: /^\/customers(\/.*)?$/,
		},
		{
			label: 'Payment',
			href: '/payments',
			icon: <SfiAdminSidebarOutlinedIcon.Transactions className="size-5" />,
			activePattern: /^\/payments(\/.*)?$/,
		},
		{
			label: 'Deposit/Withdrawal',
			href: '/transactions',
			icon: <SfiAdminSidebarOutlinedIcon.AddMoney className="size-5" />,
			activePattern: /^\/transactions(\/.*)?$/,
		},
		{
			label: 'Rates',
			href: '/rates',
			icon: <SfiAdminSidebarOutlinedIcon.TradeMovement className="size-5" />,
			activePattern: /^\/rates(\/.*)?$/,
		},
		{
			label: 'System settings',
			icon: <SfiAdminSidebarOutlinedIcon.Setting className="size-5" />,
			activePattern: /^\/settings(\/.*)?$/,
			children: [
				{
					label: 'Trading Account',
					href: '/settings/trading-account',
					activePattern: /^\/settings\/trading-account(\/.*)?$/,
				},
				{
					label: 'Symbols',
					href: '/settings/symbols',
					activePattern: /^\/settings\/symbols(\/.*)?$/,
				},
				{
					label: 'Authority',
					href: '/settings/authority',
					activePattern: /^\/settings\/authority(\/.*)?$/,
				},
				{
					label: 'Minimum Balance',
					href: '/settings/minimum-balance',
					activePattern: /^\/settings\/minimum-balance(\/.*)?$/,
				},
				{
					label: 'Email Templates',
					href: '/settings/email-templates',
					activePattern: /^\/settings\/email-templates(\/.*)?$/,
				},
				{
					label: 'Legal Documents',
					href: '/settings/legal-documents',
					activePattern: /^\/settings\/legal-documents(\/.*)?$/,
				},
			],
		},
	]

	const isActive = (item: PortalSidebarItemConfig) => isPortalSidebarItemActive(item, pathname)

	return (
		<SfiSidebarLayout widths={{ desktop: 270 }}>
			<SidebarListSfs className="border-mui-divider overflow-hidden border-r">
				<SidebarListSfs.Header className="relative flex items-center">
					<PortalSidebarHeader />
				</SidebarListSfs.Header>

				<SidebarListSfs.Content
					className={cn('scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden')}
				>
					{adminSidebarItems.map((item) => {
						return (
							<React.Fragment key={item.label}>
								<PortalSidebarItem item={item} isActive={isActive} />
								{item.divider && <SidebarListSfs.Divider className="w-full" />}
							</React.Fragment>
						)
					})}
				</SidebarListSfs.Content>
			</SidebarListSfs>
		</SfiSidebarLayout>
	)
}

export default SfiAdminSidebar
