import { getAppConfigVariables, ProjectConfig } from '@/configs'
import { localhost } from '@/configs/localhost'

/**
 * Gets the application configuration based on the current window location host or custom host provided.
 * Safely handles SSR and CSR environments.
 */
export const getAppConfig = (host?: string): ProjectConfig => {
	const currentHost = host || (typeof window !== 'undefined' ? window.location.host : '')
	return getAppConfigVariables(currentHost) || localhost
}
