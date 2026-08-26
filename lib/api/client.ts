/* eslint-disable @next/next/no-location-assign-relative-destination */
import toastUtil from '@/utils/toast'
import { getAppConfig } from '@/utils/get-app-config'
import { AxiosBuilder } from '@/lib/api/axios-builder'
import { tokenManager } from '@/lib/api/token-manager'
import { getClientApiLanguage } from '@/utils/get-language'

export const clientApi = new AxiosBuilder()
	.addRequestInterceptor(async (config) => {
		if (typeof window !== 'undefined') {
			config.params = {
				...config.params,
				lang: getClientApiLanguage(),
			}

			const appConfig = getAppConfig()
			const isBFF = appConfig.isBFF ?? true

			if (appConfig.entity) {
				config.headers.Entity = appConfig.entity
			}

			if (isBFF) {
				// BFF Mode: Route through Next.js server proxy '/proxy'.
				// Token is attached securely on the server side; NO client-side getAccessToken() call is made!
				config.baseURL = '/proxy'
			} else {
				// Direct Mode (Non-BFF): Call direct Backend API URL and inject Bearer token on client side
				if (appConfig?.api) {
					config.baseURL = appConfig.api
				} else if (process.env.NEXT_PUBLIC_API_BASE_URL) {
					config.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
				}

				try {
					const token = await tokenManager.getToken()
					if (token) {
						config.headers.Authorization = `Bearer ${token}`
					}
				} catch {
					tokenManager.clearToken()
				}
			}
		}
		return config
	})
	.setApiResponseErrorInterceptor(async (error) => {
		const status = error.response?.status

		if (status === 401 && typeof window !== 'undefined') {
			// Token or Session expired / invalid -> Clear memory token and redirect to login
			tokenManager.clearToken()
			window.location.href = '/auth/login'
			return Promise.reject(error)
		}

		if (status === 500 && typeof window !== 'undefined') {
			const serverMsg = (error.response?.data as { message?: string })?.message
			toastUtil.error(serverMsg || 'Internal Server Error. Please try again later.')
		}

		return Promise.reject(error)
	})
	.build()
