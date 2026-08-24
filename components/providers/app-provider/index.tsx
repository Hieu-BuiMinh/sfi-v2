'use client'

import { LangProvider } from '@/components/providers/lang-provider'
import { MuiProvider } from '@/components/providers/mui-provider'
import { NuqsProvider } from '@/components/providers/nuqs-provider'
import { QueryProvider } from '@/components/providers/query-client-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import React from 'react'
import { Toaster } from '@/components/toaster/sonner'
import { AbstractIntlMessages } from 'use-intl/core'

function AppProvider({
	children,
	locale,
	messages,
}: {
	children: React.ReactNode
	locale: string
	messages: AbstractIntlMessages
}) {
	return (
		<QueryProvider>
			<NuqsProvider>
				<LangProvider locale={locale} messages={messages}>
					<MuiProvider themeName="sfi">
						<SessionProvider>{children}</SessionProvider>
					</MuiProvider>
				</LangProvider>
				<Toaster />
			</NuqsProvider>
		</QueryProvider>
	)
}

export default AppProvider
