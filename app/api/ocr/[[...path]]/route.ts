import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
	params: Promise<{ path?: string[] }>
}

async function proxyRequest(request: NextRequest, { params }: RouteContext) {
	const apiUrl = process.env.API_OCR_URL
	const apiKey = process.env.API_OCR_KEY

	if (!apiUrl || !apiKey) {
		return NextResponse.json({ error: 'OCR service configuration is missing' }, { status: 500 })
	}

	const { path = [] } = await params

	if (!path.length) {
		return NextResponse.json({ error: 'OCR API path is required' }, { status: 400 })
	}

	try {
		const upstreamPath = path[0] === 'v1' ? path.slice(1) : path
		const url = new URL(`${apiUrl.replace(/\/$/, '')}/api/v1/${upstreamPath.map(encodeURIComponent).join('/')}`)

		request.nextUrl.searchParams.forEach((value, key) => {
			url.searchParams.append(key, value)
		})

		const headers = new Headers({
			Accept: request.headers.get('accept') || 'application/json',
			'x-api-key': apiKey,
		})
		const contentType = request.headers.get('content-type')

		if (contentType) headers.set('Content-Type', contentType)

		const response = await fetch(url, {
			method: request.method,
			headers,
			body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
			cache: 'no-store',
		})
		const responseHeaders = new Headers(response.headers)

		responseHeaders.delete('content-encoding')
		responseHeaders.delete('content-length')
		responseHeaders.delete('transfer-encoding')

		return new NextResponse(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		})
	} catch (error: unknown) {
		console.error('OCR Proxy Error:', error instanceof Error ? error.message : error)
		return NextResponse.json({ error: 'Failed to proxy OCR request' }, { status: 502 })
	}
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const DELETE = proxyRequest
