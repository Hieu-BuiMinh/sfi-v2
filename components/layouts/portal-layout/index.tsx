/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
'use client'

import PortalNavbar from '@/components/navigations/navbars/portal-navbar'
import { SidebarProvider } from '@/components/navigations/sidebar'
import { CircularProgress } from '@mui/material'
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

export function PortalLayoutLoading() {
	return (
		<div className="relative flex h-screen w-screen items-center justify-center">
			<img
				src="/assets/images/bg/sfi-bg.png"
				alt="portal-home"
				className="absolute inset-0 z-0 h-full w-full object-cover"
			/>
			<div className="relative z-10 flex size-full items-center justify-center">
				<CircularProgress color="inherit" />
			</div>
		</div>
	)
}
