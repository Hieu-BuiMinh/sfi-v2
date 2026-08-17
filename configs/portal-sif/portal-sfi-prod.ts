import { ProjectConfig } from '@/configs'

export const portalProdSFI = (location = ''): ProjectConfig => {
	const environment = location ? location : ''

	const onboarding_page = `https://onboarding${environment}.straitsfutures.id`
	const portal_page = `https://portal${environment}.straitsfutures.id`
	const trading_page = `https://trade${environment}.straitsfutures.id/trade`

	return {
		name: 'portal_sfi',
		entity: 'SFI',
		root_app: '/portal_sfi',
		api: `https://portalapi${environment}.straitsfutures.id`,

		routes: {
			publicUrls: ['/welcome'],
			customerUrls: [
				'/register',
				'/create-application',
				'/my-dashboard',
				'/my-applications',
				'/my-accounts',
				'/my-position',
				'/my-transactions',
				'/settings',
				'/verify-email',
			],
			adminUrls: [
				'/applications',
				'/account',
				'/staff',
				'/dashboard',
				'/trading-system',
				'/payment',
				'/client-list',
				'/transaction',
				'/settings',
				'/settings/authority',
				'/verify-email',
			],
		},
		pages: {
			onboarding_page,
			portal_page,
			trading_page,
		},

		onboarding_page,
		portal_page,
		trading_page,
		api_symbol: `https://remote${environment}.straitsfutures.id`,
		api_notification: `https://noti${environment}.straitsfutures.id`,
		entity_source: 'mt5-prod-sfi',
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
