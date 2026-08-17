import { NextRequest } from 'next/server'
import { getAuth0ByHost } from '@/lib/auth0'

/**
 * Handles Auth0 OAuth & Session routes
 */
export async function authProxy(request: NextRequest) {
	// Only intercept Auth0 routes (/auth/login, /auth/callback, /auth/logout, etc.)
	if (!request.nextUrl.pathname.startsWith('/auth')) {
		return null
	}

	const host = request.headers.get('host')
	const auth0Client = await getAuth0ByHost(host)
	const authResponse = await auth0Client.middleware(request)

	return authResponse
}
