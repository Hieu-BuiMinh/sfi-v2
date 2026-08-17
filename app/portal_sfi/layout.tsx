import AppProvider from '@/components/providers/app-provider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'SFI - Portal',
	description: 'Portal SFI Application',
	icons: {
		icon: [
			{
				url: '/assets/images/logo/favi-short-positive.png',
				type: 'image/png',
				media: '(prefers-color-scheme: light)',
			},
			{
				url: '/assets/images/logo/favi-short-negative.png',
				type: 'image/png',
				media: '(prefers-color-scheme: dark)',
			},
		],
	},
}

export default function PortalSFILayout({ children }: { children: React.ReactNode }) {
	return <AppProvider>{children}</AppProvider>
}
