/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server'
import { getAuth0ByHost } from '@/lib/auth0'
import { getAppConfig } from '@/utils/get-app-config'

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
	try {
		const resolvedParams = await params
		const pathSegments = resolvedParams.path || []
		const targetPath = pathSegments.join('/')

		const host = request.headers.get('host') || 'localhost:3000'
		const appConfig = getAppConfig(host)
		const auth0Client = await getAuth0ByHost(host)

		// Retrieve Auth0 session & token
		let token: string | undefined
		try {
			const tokenRes = await auth0Client.getAccessToken()
			token = tokenRes?.token
		} catch {
			const session = await auth0Client.getSession()
			token = (session?.accessToken as string | undefined) || (session?.idToken as string | undefined)
		}

		const beBaseUrl = (
			appConfig?.api ||
			process.env.BE_API_URL ||
			process.env.NEXT_PUBLIC_LOCAL_API_BASE ||
			'https://pokeapi.co/api/v2'
		).replace(/\/$/, '')

		const targetUrl = `${beBaseUrl}/${targetPath}${request.nextUrl.search}`
		console.log('[BFF Proxy Forwarding]:', request.method, targetUrl)

		const reqHeaders = new Headers()
		if (token) {
			reqHeaders.set('Authorization', `Bearer ${token}`)
		}
		if (request.headers.has('content-type')) {
			reqHeaders.set('Content-Type', request.headers.get('content-type')!)
		}
		if (request.headers.has('accept')) {
			reqHeaders.set('Accept', request.headers.get('accept')!)
		}
		if (request.headers.has('entity')) {
			reqHeaders.set('Entity', request.headers.get('entity')!)
		}

		const reqBody = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer()

		const response = await fetch(targetUrl, {
			method: request.method,
			headers: reqHeaders,
			body: reqBody,
		})

		const data = await response.arrayBuffer()

		return new NextResponse(data, {
			status: response.status,
			statusText: response.statusText,
			headers: {
				'Content-Type': response.headers.get('content-type') || 'application/json',
			},
		})
	} catch (error: any) {
		console.error('[BFF Proxy Error]', error)
		return NextResponse.json({ error: error.message || 'BFF Proxy Error' }, { status: 500 })
	}
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const DELETE = handleProxy
export const PATCH = handleProxy
