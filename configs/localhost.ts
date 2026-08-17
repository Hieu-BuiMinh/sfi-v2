import { ProjectConfig } from '@/configs'

const name = process.env.NEXT_PUBLIC_LOCAL_ROOT_APP || ''

export const localhost: ProjectConfig = {
	name: name.replace('/', ''),
	entity: process.env.NEXT_PUBLIC_LOCAL_ENTITY || '',
	root_app: process.env.NEXT_PUBLIC_LOCAL_ROOT_APP || '/onboarding_sfi',
	api: process.env.NEXT_PUBLIC_LOCAL_API_BASE || '',
	isBFF: !true,

	routes: {
		publicUrls: ['/', '/welcome'],
		onboardingUrls: ['/register', '/create-application', '/corporate', '/individual', '/verify-email', '/pokemon'],
		customerUrls: ['/my-dashboard'],
		adminUrls: ['/dashboard', '/applications'],
	},
	pages: {
		onboarding_page: process.env.NEXT_PUBLIC_LOCAL_ONBOARDING_PAGE || '',
		portal_page: process.env.NEXT_PUBLIC_LOCAL_PORTAL_PAGE || '',
		trading_page: process.env.NEXT_PUBLIC_LOCAL_TRADING_PAGE || 'https://trade-uat.panasia.id/trade',
	},

	onboarding_page: process.env.NEXT_PUBLIC_LOCAL_ONBOARDING_PAGE || '',
	portal_page: process.env.NEXT_PUBLIC_LOCAL_PORTAL_PAGE || '',
	trading_page: process.env.NEXT_PUBLIC_LOCAL_TRADING_PAGE || 'https://trade-uat.panasia.id/trade',
	api_notification: process.env.NEXT_PUBLIC_LOCAL_API_NOTIFICATION || '',
	vnpt: {
		api: 'https://sandbox-idg.vnpt.vn',
		tokenId: '3575f760-a99e-75c0-e063-2008a30af267',
		tokenKey:
			'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIl7sc26IxKbglotmTNEQ2LbNjtYF9jF68MG3yvo2c4w4oovNKRkgueJTHaLPX8HPNPG3R7/RIOnwQ49+pqKo6cCAwEAAQ==',
		accessToken:
			'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvbl9pZCI6ImE1NGY3OWNkLWU5YzEtNGIxNi1iNTQ2LTU3NDk4ZjVjYjg1MCIsInN1YiI6IjM1NzVkYjNhLTNlZDYtNTJjMy1lMDYzLTFmMDhhMzBhZTVlMCIsImF1ZCI6WyJyZXN0c2VydmljZSJdLCJ1c2VyX25hbWUiOiJzdXBwb3J0LnNmdm5Ac3RyYWl0c2ZpbmFuY2lhbC5jb20iLCJzY29wZSI6WyJyZWFkIl0sImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0IiwibmFtZSI6InN1cHBvcnQuc2Z2bkBzdHJhaXRzZmluYW5jaWFsLmNvbSIsInV1aWRfYWNjb3VudCI6IjM1NzVkYjNhLTNlZDYtNTJjMy1lMDYzLTFmMDhhMzBhZTVlMCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiNWEyYWE1ZjgtZDM0YS00OTU5LTk3MjAtYjU1Mzc2ZTI1NGZiIiwiY2xpZW50X2lkIjoiYWRtaW5hcHAifQ.Q6HmJAVM0B---oxqQEBmMXQtxGrK4sebWY4ipgm4WIg5ZYZR5_3zSBemktlMi--OCSWLOwQsWmpEdrwRghQ9MnBAp7GYDHcoanxL8z0eaU6tyrG4lWjjrkXAnxdBUnzsfOn73KkbMDFK92ncoDRX13ADgYQaYDqzdMBt_QlSXBMFxXEdYAXGdNpqXSl7Q9JG6xluzQv0imTQxIkmg3ySRuNyfE-i-HZuJESVB0qRJuYK94nLRP2o6tQuL0lFX-jFxB8WtU2yr6hstkL6c-k-CbAmh4gHAzLff0iYAtKRN5al1jySlKnoi2XjxgqUp7DM-d-G35jJjeOn6G47q1ojbg',
	},
	econtract: {
		portal_url: 'https://econtract-v2-poc.vnptit3.vn',
	},
	defaultLanguage: 'en',
	node_env: 'UAT',
	languages: [
		{
			id: 'en',
			name: 'English',
			shortName: 'en',
		},
		{
			id: 'id',
			name: 'Bahasa',
			shortName: 'id',
		},
		{
			id: 'zh',
			name: 'Chinese',
			shortName: 'zh',
		},
	],
}
