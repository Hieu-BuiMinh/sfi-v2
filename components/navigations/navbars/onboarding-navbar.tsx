'use client'

import ModeToggle from '@/components/buttons/mode-toggle'
import UserButton from '@/components/buttons/user-button'
import SfiLogo from '@/components/logos/sfi'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@mui/material'
import Link from 'next/link'

function OnboardingNavbar() {
	const { isAuthenticated } = useAuth()

	return (
		<div className="flex h-14 items-center justify-center border-b px-4">
			<div className="flex w-full max-w-7xl items-center justify-between">
				{/* Logo Brand Responsive Variants */}
				<Link href="/" className="flex items-center">
					{/* Full Logo - Desktop & Tablet (Light / Dark) */}
					<SfiLogo variant="full-positive" className="hidden sm:block dark:hidden" />
					<SfiLogo variant="full-negative" className="hidden dark:sm:block" />

					{/* Short Logo - Mobile (Light / Dark) */}
					<SfiLogo variant="short-positive" className="block sm:hidden dark:hidden" />
					<SfiLogo variant="short-negative" className="hidden dark:block dark:sm:hidden" />
				</Link>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<ModeToggle />
					{isAuthenticated ? (
						<UserButton />
					) : (
						<Button href="/auth/login" size="small" variant="contained">
							Login
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}

export default OnboardingNavbar
