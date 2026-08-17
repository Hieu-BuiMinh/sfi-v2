import OnboardingLayout from '@/components/layouts/onboarding-layout'
import { ReactNode } from 'react'

function AuthLayout({ children }: { children: ReactNode }) {
	return <OnboardingLayout>{children}</OnboardingLayout>
}

export default AuthLayout
