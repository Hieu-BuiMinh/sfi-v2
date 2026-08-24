'use client'

import { SfiCustomerSidebarOutlinedIcon } from '@/components/icons/sidebar/customer-sidebar-icon-outlined'
import { SfiAdminSidebarOutlinedIcon } from '@/components/icons/sidebar/admin-sidebar-icon-outlined'
import { SfiSidebarLayout, SidebarListSfs } from '@/components/navigations/sidebar'
import PortalSidebarHeader from '@/components/navigations/sidebar/portal-sidebar-header'
import PortalSidebarItem from '@/components/navigations/sidebar/portal-sidebar-item'
import {
	isPortalSidebarItemActive,
	PortalSidebarItemConfig,
} from '@/components/navigations/sidebar/portal-sidebar-config'
import { usePathname } from 'next/navigation'
import React from 'react'

function SFICustomerSidebar() {
	const pathname = usePathname()

	const sidebarItems: PortalSidebarItemConfig[] = [
		{
			label: 'Dashboard',
			href: '/my-dashboard',
			icon: <SfiCustomerSidebarOutlinedIcon.Dashboard className="size-6" />,
			activePattern: /^\/my-dashboard\/?$/,
			divider: true,
		},
		{
			label: 'Accounts',
			href: '/my-accounts',
			icon: <SfiAdminSidebarOutlinedIcon.Accounts className="size-6" />,
			activePattern: /^\/my-accounts(\/.*)?$/,
		},
		{
			label: 'Applications',
			href: '/my-applications',
			icon: <SfiAdminSidebarOutlinedIcon.AccountApplications className="size-6" />,
			activePattern: /^\/my-applications(\/.*)?$/,
		},
		{
			label: 'Positions',
			href: '/my-positions',
			icon: <SfiAdminSidebarOutlinedIcon.Positions className="size-6" />,
			activePattern: /^\/my-positions(\/.*)?$/,
		},
		{
			label: 'Deposit & Withdrawal',
			href: '/my-transactions',
			icon: <SfiAdminSidebarOutlinedIcon.Transactions className="size-6" />,
			activePattern: /^\/my-transactions(\/.*)?$/,
		},
	]

	const isActive = (item: PortalSidebarItemConfig) => isPortalSidebarItemActive(item, pathname)

	return (
		<SfiSidebarLayout widths={{ desktop: 270 }}>
			<SidebarListSfs className="border-mui-divider overflow-hidden border-r">
				<SidebarListSfs.Header className="relative flex items-center">
					<PortalSidebarHeader />
				</SidebarListSfs.Header>

				<SidebarListSfs.Content className="scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
					{sidebarItems.map((item) => {
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

export default SFICustomerSidebar
