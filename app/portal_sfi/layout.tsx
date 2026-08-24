import AppProvider from '@/components/providers/app-provider'
import enMessages from '@/configs/portal-sif/messages/en.json'
import idMessages from '@/configs/portal-sif/messages/vi.json'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
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

export default async function PortalSFILayout({ children }: { children: React.ReactNode }) {
	const requestedLocale = (await cookies()).get('NEXT_LOCALE')?.value
	const locale = requestedLocale === 'id' ? 'id' : 'en'
	const messages = locale === 'id' ? idMessages : enMessages

	return (
		<AppProvider locale={locale} messages={messages}>
			{children}
		</AppProvider>
	)
}
