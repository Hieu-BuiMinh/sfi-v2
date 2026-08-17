/* eslint-disable @typescript-eslint/no-explicit-any */

import { localhost } from '@/configs/localhost'
import { onboardingProdSFI } from '@/configs/onboarding-sfi/onboarding-sfi-prod'
import { onboardingUatSFI } from '@/configs/onboarding-sfi/onboarding-sfi-uat'
import { portalProdSFI } from '@/configs/portal-sif/portal-sfi-prod'
import { portalUatSFI } from '@/configs/portal-sif/portal-sfi-uat'

export interface LanguageOption {
	id: string
	name: string
	shortName: string
}

export interface RoutePermissionsConfig {
	/** Routes accessible without authentication (e.g. /welcome, /verify-email) */
	publicUrls?: string[]
	/** Onboarding accessible routes (e.g. /register, /create-application) */
	onboardingUrls?: string[]
	/** Customer/Client accessible routes (e.g. /my-dashboard, /my-accounts) */
	customerUrls: string[]
	/** Admin/Staff accessible routes (e.g. /dashboard, /applications, /settings) */
	adminUrls: string[]
}

export interface RelatedPagesConfig {
	onboarding_page?: string
	portal_page?: string
	trading_page?: string
	website?: string
	homePage?: string
}

export type ProjectConfig = {
	name: string
	entity: string
	root_app: string
	node_env?: 'DEVELOP' | 'UAT' | 'PRODUCTION' | string

	/** Base API endpoint URL */
	api: string

	/** Flag to determine whether client calls direct API (isBFF: true) or uses server proxy (/proxy) (isBFF: false) */
	isBFF?: boolean

	/** Route permission configuration */
	routes: RoutePermissionsConfig
	/** System ecosystem pages */
	pages?: RelatedPagesConfig

	// Localization & Business specifics
	defaultLanguage: string
	languages?: LanguageOption[]
	currency?: string
	entity_source?: string
	product_list?: string[]

	[key: string]: any
}

type VariableConfig = {
	[key: string]: ProjectConfig
}

const variableConfig: VariableConfig = {
	'localhost:3000': {
		...localhost,
	},
	// SFI UAT
	'onboarding-uat.straitsfutures.id': {
		...onboardingUatSFI,
	},
	'portal-uat.straitsfutures.id': {
		...portalUatSFI,
	},
	// SFI PROD
	'onboarding.straitsfinancial.id': {
		...onboardingProdSFI(),
	},
	'portal.straitsfinancial.id': {
		...portalProdSFI(),
	},
}

export const getAppConfigVariables = (host: string): ProjectConfig | undefined => {
	const root = process.env.NEXT_PUBLIC_APP_ROOT

	if (root) {
		switch (root) {
			case '/onboarding_sfi':
				return onboardingUatSFI
			case '/portal_sfi':
				return portalUatSFI
			default:
				break
		}
	}

	return variableConfig?.[host] || variableConfig['localhost:3000']
}
