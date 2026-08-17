'use client'

import { useAuth } from '@/hooks/use-auth'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const { auth } = useAuth()
	const router = useRouter()
	const pathname = usePathname()

	React.useEffect(() => {
		if (auth && auth.email_verified === false && pathname !== '/verify-email') {
			router.push('/verify-email')
		}
	}, [auth, pathname, router])

	return <>{children}</>
}
