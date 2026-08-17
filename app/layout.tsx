import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'SFI Application',
	description: 'SFI Application Portal & Onboarding',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${montserrat.variable} ${montserrat.className} h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<InitColorSchemeScript attribute="data-mui-color-scheme" />
			</head>
			<body className="flex min-h-full flex-col" suppressHydrationWarning>
				{children}
			</body>
		</html>
	)
}
