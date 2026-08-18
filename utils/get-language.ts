import type { NextRequest } from 'next/server'

export type ApiLanguage = 'id' | 'en'

export function mapLocaleToApiLanguage(locale?: string | null): ApiLanguage {
	return locale?.toLowerCase().startsWith('id') ? 'id' : 'en'
}

export function getClientApiLanguage(): ApiLanguage {
	if (typeof document === 'undefined') return 'en'

	const localeCookie = document.cookie
		.split('; ')
		.find((cookie) => cookie.startsWith('NEXT_LOCALE='))
		?.split('=')[1]

	return mapLocaleToApiLanguage(localeCookie ? decodeURIComponent(localeCookie) : document.documentElement.lang)
}

export function getServerApiLanguage(request?: NextRequest): ApiLanguage {
	return mapLocaleToApiLanguage(
		request?.cookies.get('NEXT_LOCALE')?.value || request?.headers.get('accept-language')?.split(',')[0]
	)
}
