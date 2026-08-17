import { NextRequest, NextResponse } from 'next/server'
import { getAppConfig } from '@/utils/get-app-config'

/**
 * Sub-proxy for routing sub-apps/features based on domain host
 */
export async function rootAppProxy(request: NextRequest) {
	const url = request.nextUrl.clone()

	// Bỏ qua static files, assets, api và auth endpoints (/auth/login, /auth/callback,...)
	if (
		url.pathname.startsWith('/_next') ||
		url.pathname.startsWith('/api') ||
		url.pathname.startsWith('/auth') ||
		url.pathname.startsWith('/proxy') ||
		url.pathname.includes('.')
	) {
		return null
	}

	const host = request.headers.get('host') || 'localhost:3000'

	const config = getAppConfig(host)
	const rootApp = config.root_app || '/onboarding_sfi'

	// Tránh rewrite nếu URL đã có tiền tố rootApp
	if (rootApp && !url.pathname.startsWith(rootApp)) {
		url.pathname = `${rootApp}${url.pathname === '/' ? '' : url.pathname}`
		return NextResponse.rewrite(url, { headers: request.headers })
	}

	return null
}
