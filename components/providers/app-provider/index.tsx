'use client'

import { LangProvider } from '@/components/providers/lang-provider'
import { MuiProvider } from '@/components/providers/mui-provider'
import { NuqsProvider } from '@/components/providers/nuqs-provider'
import { QueryProvider } from '@/components/providers/query-client-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import React from 'react'
import { Toaster } from '@/components/toaster/sonner'

function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<QueryProvider>
			<NuqsProvider>
				<LangProvider>
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
