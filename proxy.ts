import { NextRequest } from 'next/server'
import { createProxyChain } from './proxies/chain'
import { authProxy } from './proxies/auth.proxy'
import { routeProtectionProxy } from './proxies/route-protection.proxy'
import { rootAppProxy } from './proxies/root-app.proxy'

const proxyPipeline = createProxyChain(authProxy, routeProtectionProxy, rootAppProxy)

export async function proxy(request: NextRequest) {
	return proxyPipeline(request)
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
