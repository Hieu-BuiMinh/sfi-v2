import { AxiosBuilder } from '@/lib/api/client/axios-builder'
import { getAuth0ByHost } from '@/lib/auth0'
import { NextRequest } from 'next/server'

// Server-Side API: Creates a request-isolated Axios client for server components or route handlers.
export async function createServerApi(request?: NextRequest) {
	const serverApi = new AxiosBuilder()
		.setBaseUrl(process.env.BE_API_URL || 'http://localhost:8080')
		.setApiResponseErrorInterceptor((error: import('axios').AxiosError) => {
			console.error('[SERVER API ERROR]', error?.response?.status, error?.message)
			return Promise.reject(error)
		})

	try {
		const host = request?.headers?.get('host')
		const auth0Client = await getAuth0ByHost(host)

		let token: string | undefined
		try {
			const tokenRes = await auth0Client.getAccessToken()
			token = tokenRes?.token
		} catch {
			const session = await auth0Client.getSession()
			token = (session?.accessToken as string | undefined) || (session?.idToken as string | undefined)
		}

		if (token) {
			serverApi.setToken(token)
		}
	} catch {
		// Silently ignore if unauthenticated or request context is missing
	}

	return serverApi.build()
}
