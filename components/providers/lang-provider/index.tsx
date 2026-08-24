'use client'

import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { AbstractIntlMessages } from 'use-intl/core'

interface LangProviderProps {
	children: React.ReactNode
	locale: string
	messages: AbstractIntlMessages
}

export function LangProvider({ children, locale, messages }: LangProviderProps) {
	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	)
}

export default LangProvider
