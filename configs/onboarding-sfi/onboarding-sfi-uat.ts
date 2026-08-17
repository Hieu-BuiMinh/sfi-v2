import { ProjectConfig } from '@/configs'

export const onboardingUatSFI: ProjectConfig = {
	name: 'onboarding_sfi',
	entity: 'SFI',
	root_app: '/onboarding_sfi',
	api: 'https://portalapi-uat.straitsfutures.id',

	routes: {
		publicUrls: ['/welcome'],
		customerUrls: ['/register', '/create-application', '/verify-email'],
		adminUrls: ['/verify-email'],
	},
	pages: {
		onboarding_page: 'https://onboarding-uat.straitsfutures.id',
		portal_page: 'https://portal-uat.straitsfutures.id',
		trading_page: 'https://trade-uat.straitsfutures.id/trade',
	},

	onboarding_page: 'https://onboarding-uat.straitsfutures.id',
	portal_page: 'https://portal-uat.straitsfutures.id',
	trading_page: 'https://trade-uat.straitsfutures.id/trade',
	api_symbol: 'https://remote-uat.mapsinfotech.com',
	api_notification: 'https://noti-uat.sdamarkets.com',
	currency: '$',
	product_list: ['nano_contracts_sfi'],
	defaultLanguage: 'en',
	node_env: 'UAT',
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
