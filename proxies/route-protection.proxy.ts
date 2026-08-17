import { NextRequest, NextResponse } from 'next/server'
import { getAuth0ByHost } from '@/lib/auth0'
import { getAppConfig } from '@/utils/get-app-config'

/**
 * Route protection and email verification enforcement proxy
 */
export async function routeProtectionProxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Ignore static assets, next internal routes, and Auth0 handlers (/auth/*)
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		pathname.startsWith('/auth') ||
		pathname.includes('.')
	) {
		return null
	}

	const host = request.headers.get('host') || 'localhost:3000'
	const config = getAppConfig(host)

	const publicUrls = config.routes.publicUrls || ['/', '/welcome', '/verify-email']
	const isPublicUrl = publicUrls.some((url) => pathname === url || pathname.endsWith(url))

	// Fetch Auth0 session
	const auth0Client = await getAuth0ByHost(host)
	const session = await auth0Client.getSession(request)

	// 1. Unauthenticated users trying to access protected routes -> Redirect to Login
	if (!session && !isPublicUrl) {
		const loginUrl = new URL('/auth/login', request.url)
		loginUrl.searchParams.set('returnTo', pathname)
		return NextResponse.redirect(loginUrl)
	}

	// 2. Authenticated user but email is NOT verified -> Redirect to /verify-email
	if (session && !session.user.email_verified) {
		const isVerifyPage = pathname.endsWith('/verify-email')

		// Force unverified user to stay on /verify-email page
		if (!isVerifyPage) {
			return NextResponse.redirect(new URL('/verify-email', request.url))
		}
	}

	// 3. Authenticated user with verified email trying to access /verify-email -> Redirect to home/dashboard
	if (session && session.user.email_verified && pathname.endsWith('/verify-email')) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return null
}
