import { Auth0ClientOptions } from '@auth0/nextjs-auth0/types'

type Auth0Config = {
	[key: string]: Auth0ClientOptions
}

const defaultSecret = process.env.AUTH0_SECRET || 'a783325b27e7c0e071b8481e78ba3c595f7dbbfc69656aecf74297b6ed7bd1ad'

export const auth0Config: Auth0Config = {
	'localhost:3000': {
		secret: defaultSecret,
		clientId: process.env.NEXT_PUBLIC_LOCAL_CLIENT_ID || 'DAAXPXoleCoUFmryj3ZpPESBYASboUjv',
		clientSecret:
			process.env.NEXT_PUBLIC_LOCAL_CLIENT_SECRET ||
			'kzxHDzVkncmj63YERm_RpHOPQs9O_PI1_8EjKf4qOSXKvwSzszwt54Xrfccgw-e6',
		domain: process.env.NEXT_PUBLIC_LOCAL_ISSUER_BASE_URL?.replace(/^https?:\/\//, '') || 'straitsapp.au.auth0.com',
		authorizationParameters: {
			scope: 'openid offline_access email profile',
			audience: process.env.NEXT_PUBLIC_LOCAL_AUDIENCE || 'https://maps2-dev.straitsfinancial.com/',
			connection: 'SFI-DB-UAT',
		},
		session: {},
	},
	// SFI
	'onboarding-uat.straitsfutures.id': {
		secret: defaultSecret,
		clientId: process.env.SFI_UAT_CLIENT_ID || 'DAAXPXoleCoUFmryj3ZpPESBYASboUjv',
		clientSecret:
			process.env.SFI_UAT_CLIENT_SECRET || 'kzxHDzVkncmj63YERm_RpHOPQs9O_PI1_8EjKf4qOSXKvwSzszwt54Xrfccgw-e6',
		domain: process.env.SFI_UAT_ISSUER_BASE_URL?.replace(/^https?:\/\//, '') || 'straitsapp.au.auth0.com',
		authorizationParameters: {
			scope: 'openid offline_access email profile',
			audience: process.env.SFI_UAT_AUDIENCE || 'https://maps2-dev.straitsfinancial.com/',
			connection: 'SFI-DB-UAT',
		},
		session: {
			cookie: {
				domain: process.env.SFI_UAT_DOMAIN || '.straitsfutures.id',
				sameSite: 'none',
				path: '/',
				secure: true,
			},
		},
	},
	'portal-uat.straitsfutures.id': {
		secret: defaultSecret,
		clientId: process.env.SFI_UAT_CLIENT_ID || 'DAAXPXoleCoUFmryj3ZpPESBYASboUjv',
		clientSecret:
			process.env.SFI_UAT_CLIENT_SECRET || 'kzxHDzVkncmj63YERm_RpHOPQs9O_PI1_8EjKf4qOSXKvwSzszwt54Xrfccgw-e6',
		domain: process.env.SFI_UAT_ISSUER_BASE_URL?.replace(/^https?:\/\//, '') || 'straitsapp.au.auth0.com',
		authorizationParameters: {
			scope: 'openid offline_access email profile',
			audience: process.env.SFI_UAT_AUDIENCE || 'https://maps2-dev.straitsfinancial.com/',
			connection: 'SFI-DB-UAT',
		},
		session: {
			cookie: {
				domain: process.env.SFI_UAT_DOMAIN || '.straitsfutures.id',
				sameSite: 'none',
				path: '/',
				secure: true,
			},
		},
	},
}
