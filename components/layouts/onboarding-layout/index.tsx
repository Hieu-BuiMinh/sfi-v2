import OnboardingNavbar from '@/components/navigations/navbars/onboarding-navbar'
import { ReactNode } from 'react'

export type OnboardingLayoutProps = {
	children: ReactNode
}

function OnboardingLayout({ children }: OnboardingLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col justify-between gap-0">
			{/* navbar */}
			<OnboardingNavbar />
			<div className="mx-auto w-full max-w-7xl flex-1 p-3 sm:p-5">{children}</div>
		</div>
	)
}

export default OnboardingLayout
