'use client'

import PortalLayoutLoading from '@/components/loading/portal-layout-loading'
import { PortalUserRole } from '@/dto/enums/user'
import { useAuth } from '@/hooks/use-auth'
import useProfile from '@/hooks/use-profile'
import HomePageView from '@/views/landing-page_sfi/pages/home.page'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SFIHomePage() {
	const { isAuthenticated, isLoading } = useAuth()

	if (isLoading) return <PortalLayoutLoading />
	if (isAuthenticated) return <AuthenticatedPortalRedirect />

	return <HomePageView />
}

function AuthenticatedPortalRedirect() {
	const router = useRouter()
	const { isLoading, user } = useProfile()

	useEffect(() => {
		if (isLoading) return
		router.replace(user?.is_staff === PortalUserRole.ADMIN ? '/dashboard' : '/my-dashboard')
	}, [isLoading, router, user?.is_staff])

	return <PortalLayoutLoading />
}
