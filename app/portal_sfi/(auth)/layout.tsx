'use client'

import SfiPortalLayout, { SfiAdminSidebar, SFICustomerSidebar } from '@/components/layouts/portal-layout'
import PortalLayoutLoading from '@/components/loading/portal-layout-loading'
import { PortalUserRole } from '@/dto/enums/user'
import useProfile from '@/hooks/use-profile'

export default function AuthenticatedPortalLayout({ children }: { children: React.ReactNode }) {
	const { isLoading, user } = useProfile()

	if (isLoading) return <PortalLayoutLoading />

	const Sidebar = user?.is_staff === PortalUserRole.ADMIN ? SfiAdminSidebar : SFICustomerSidebar

	return <SfiPortalLayout Sidebar={Sidebar}>{children}</SfiPortalLayout>
}
