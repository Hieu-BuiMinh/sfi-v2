/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import PortalLayoutLoading from '@/components/loading/portal-layout-loading'
import PortalNavbar from '@/components/navigations/navbars/portal-navbar'
import { SidebarProvider } from '@/components/navigations/sidebar'
import React, { useEffect, useState } from 'react'
import SFICustomerSidebar from './customer-sidebar'

interface SfiPortalLayoutProps {
	children: React.ReactNode
	Sidebar?: React.ComponentType
}

function SfiPortalLayout({ children, Sidebar = SFICustomerSidebar }: SfiPortalLayoutProps) {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		setLoaded(true)
	}, [])

	if (!loaded) {
		return <PortalLayoutLoading />
	}

	return (
		<SidebarProvider>
			<div className="flex h-screen overflow-hidden">
				<Sidebar />
				<div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-y-auto dark:bg-[#1F2A37]">
					<PortalNavbar />
					{children}
				</div>
			</div>
		</SidebarProvider>
	)
}

export default SfiPortalLayout

export { default as SfiAdminSidebar } from './admin-sidebar'
export { default as SFICustomerSidebar } from './customer-sidebar'
