import onboardingEnMessages from '@/configs/onboarding-sfi/messages/en.json'
import onboardingIdMessages from '@/configs/onboarding-sfi/messages/vi.json'
import portalEnMessages from '@/configs/portal-sif/messages/en.json'
import portalIdMessages from '@/configs/portal-sif/messages/vi.json'
import { getAppConfig } from '@/utils/get-app-config'
import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

const messagesByEntity = {
	SFI: {
		'/onboarding_sfi': {
			en: onboardingEnMessages,
			id: onboardingIdMessages,
		},
		'/portal_sfi': {
			en: portalEnMessages,
			id: portalIdMessages,
		},
	},
} as const

export default getRequestConfig(async () => {
	const requestedLocale = (await cookies()).get('NEXT_LOCALE')?.value
	let locale: 'en' | 'id'

	switch (requestedLocale) {
		case 'id':
			locale = 'id'
			break
		default:
			locale = 'en'
	}

	const host = (await headers()).get('host') ?? undefined
	const appConfig = getAppConfig(host)
	const messages =
		messagesByEntity[appConfig.entity as keyof typeof messagesByEntity][
			appConfig.root_app as keyof (typeof messagesByEntity)['SFI']
		][locale]

	return {
		locale,
		messages,
	}
})
