import { ProjectConfig } from '@/configs'

export const onboardingProdSFI = (location = ''): ProjectConfig => {
	const environment = location ? location : ''

	const onboarding_page = `https://onboarding${environment}.straitsfinancial.id`
	const portal_page = `https://portal${environment}.straitsfinancial.id`
	const trading_page = `https://trade${environment}.straitsfinancial.id/trade`

	return {
		name: 'onboarding_sfi',
		entity: 'SFI',
		root_app: '/onboarding_sfi',
		api: `https://portalapi${environment}.straitsfinancial.id`,

		routes: {
			publicUrls: ['/welcome'],
			customerUrls: ['/register', '/create-application', '/verify-email'],
			adminUrls: ['/verify-email'],
		},
		pages: {
			onboarding_page,
			portal_page,
			trading_page,
		},

		onboarding_page,
		portal_page,
		trading_page,
		api_symbol: `https://remote${environment}.mapsinfotech.com`,
		api_notification: `https://noti${environment}.straitsfinancial.id`,
		currency: '$',
		product_list: ['nano_contracts_sfi'],
		defaultLanguage: 'en',
		node_env: 'PRODUCTION',
		languages: [
			{
				id: 'id',
				name: 'Bahasa',
				shortName: 'id',
			},
			{
				id: 'en',
				name: 'English',
				shortName: 'en',
			},
			{
				id: 'zh',
				name: '中文',
				shortName: 'zh',
			},
		],
	}
}
