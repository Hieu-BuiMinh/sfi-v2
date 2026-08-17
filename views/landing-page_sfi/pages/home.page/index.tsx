'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@mui/material'
import Link from 'next/link'

export type HomePageViewProps = {
	authenticatedHref?: string
}

function HomePageView({ authenticatedHref = '/register' }: HomePageViewProps) {
	const { isAuthenticated, auth } = useAuth()

	console.log('auth', auth, isAuthenticated, auth)

	return (
		<div className="m-auto flex h-[calc(100vh-3.5rem)] w-full max-w-7xl items-center justify-center p-3 sm:p-5">
			<div className="flex w-full flex-col gap-5 max-sm:text-center">
				<span className="text-4xl font-bold text-white md:text-6xl">The Only Trading Platform</span>
				<span className="text-2xl font-bold text-white md:text-3xl">to simplify your trading</span>

				{!isAuthenticated ? (
					<Button
						size="large"
						variant="contained"
						className="text-mui-primary! w-full font-bold sm:w-fit"
						LinkComponent={Link}
						color="white"
						href="/auth/login?screen_hint=signup"
					>
						Register Now
					</Button>
				) : (
					<Button
						size="large"
						variant="contained"
						className="text-mui-primary! w-full font-bold sm:w-fit"
						LinkComponent={Link}
						color="white"
						href={authenticatedHref}
					>
						Let&apos;s Explore
					</Button>
				)}
			</div>
		</div>
	)
}

export default HomePageView
