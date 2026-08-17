/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import UserButton from '@/components/buttons/user-button'
import SfiLogo from '@/components/logos/sfi'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/utils/cn'
import { Button } from '@mui/material'

export type LandingPageNavbarProps = {
	mode?: 'light' | 'dark'
}

function LadingPageNavbar({ mode = 'light' }: LandingPageNavbarProps) {
	const { isAuthenticated } = useAuth()

	const renderLogo = () => {
		if (mode === 'dark') {
			return (
				<>
					<SfiLogo variant="full-negative" className="hidden sm:block" />
					<SfiLogo variant="short-negative" className="block sm:hidden" />
				</>
			)
		}

		if (mode === 'light') {
			return (
				<>
					<SfiLogo variant="full-positive" className="hidden sm:block" />
					<SfiLogo variant="short-positive" className="block sm:hidden" />
				</>
			)
		}

		return (
			<>
				{/* Full Logo - Desktop & Tablet (Light / Dark) */}
				<SfiLogo variant="full-positive" className="hidden sm:block dark:hidden" />
				<SfiLogo variant="full-negative" className="hidden dark:sm:block" />

				{/* Short Logo - Mobile (Light / Dark) */}
				<SfiLogo variant="short-positive" className="block sm:hidden dark:hidden" />
				<SfiLogo variant="short-negative" className="hidden dark:block dark:sm:hidden" />
			</>
		)
	}

	return (
		<div
			className={cn(
				'flex h-14 items-center justify-center border-b bg-white px-4',
				mode === 'dark' && 'bg-mui-bg-default'
			)}
		>
			<div className="flex w-full max-w-7xl items-center justify-between">
				{/* Logo Brand Responsive Variants */}
				<div className="flex items-center">{renderLogo()}</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					{isAuthenticated ? (
						<UserButton mode={mode} />
					) : (
						<Button
							href="/auth/login"
							size="small"
							variant="contained"
							color={(mode === 'dark' ? 'inherit' : 'primary') as any}
							className={mode === 'dark' ? 'text-mui-primary! font-bold' : 'text-white'}
						>
							Login
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}

export default LadingPageNavbar
