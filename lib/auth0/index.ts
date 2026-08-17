/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from 'next/headers'
import { Auth0Client } from '@auth0/nextjs-auth0/server'
import { auth0Config } from './auth0-variables'

// Cache Auth0Client instances per host to avoid re-instantiating on every request
const clientCache = new Map<string, Auth0Client>()

/**
 * Dynamically retrieves or instantiates an Auth0Client instance based on the host header.
 * Supports multi-tenant / multi-domain configurations.
 */
export async function getAuth0ByHost(host?: string | null): Promise<Auth0Client> {
	let targetHost = host

	if (!targetHost) {
		try {
			const headerList = await headers()
			targetHost = headerList.get('host')
		} catch {
			targetHost = 'localhost:3000'
		}
	}

	const hostKey = targetHost || 'localhost:3000'

	if (clientCache.has(hostKey)) {
		return clientCache.get(hostKey)!
	}

	const config = auth0Config[hostKey] || auth0Config['localhost:3000']

	const isDev = process.env.NODE_ENV === 'development'
	const appBaseUrl = isDev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_APP_BASE_URL || `https://${hostKey}`

	const client = new Auth0Client({
		appBaseUrl,
		...config,
	})

	clientCache.set(hostKey, client)
	return client
}

/**
 * Proxy instance that delegates method calls dynamically based on request host.
 */
export const auth0 = new Proxy({} as Auth0Client, {
	get(_target, prop: keyof Auth0Client) {
		return async (...args: any[]) => {
			const client = await getAuth0ByHost()
			const member = (client as any)[prop]
			if (typeof member === 'function') {
				return member.apply(client, args)
			}
			return member
		}
	},
})
