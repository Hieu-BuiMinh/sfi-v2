import LadingPageNavbar from '@/components/navigations/navbars/landing-page-navbar'
import Image from 'next/image'
import { ReactNode } from 'react'
import sfiBg from '@/public/assets/images/bg/sfi-bg.png'

export type LandingPageLayoutProps = {
	children: ReactNode
	mode?: 'light' | 'dark'
}

function LandingPageLayout({ children, mode = 'light' }: LandingPageLayoutProps) {
	return (
		<div className="relative flex min-h-screen flex-col justify-between gap-0">
			{/* navbar */}
			<LadingPageNavbar mode={mode} />
			<div className="relative flex flex-1 flex-col">
				{/* Background Image Layer */}
				<Image
					src={sfiBg}
					fill
					preload
					sizes="100vw"
					alt="sfi-bg"
					unoptimized
					className="pointer-events-none absolute inset-0 object-cover"
				/>
				{/* Foreground Content Layer */}
				<div className="relative z-10 flex flex-1 flex-col">{children}</div>
			</div>
			{/* footer */}
			{/* <LandingPageFooter /> */}
		</div>
	)
}

export default LandingPageLayout
