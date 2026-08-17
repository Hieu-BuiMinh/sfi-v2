import LandingPageLayout from '@/components/layouts/landing-page-layout'
import { ReactNode } from 'react'

function UnAuthLayout({ children }: { children: ReactNode }) {
	return <LandingPageLayout>{children}</LandingPageLayout>
}

export default UnAuthLayout
