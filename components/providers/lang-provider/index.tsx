'use client'

import React from 'react'
import { NextIntlClientProvider } from 'next-intl'

interface LangProviderProps {
	children: React.ReactNode
	locale?: string
	messages?: Record<string, string>
}

export function LangProvider({ children, locale = 'en', messages = {} }: LangProviderProps) {
	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	)
}

export default LangProvider
