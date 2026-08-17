import { NextRequest, NextResponse } from 'next/server'

export type CustomProxyHandler = (
	request: NextRequest
) => Promise<NextResponse | Response | null | void> | NextResponse | Response | null | void

/**
 * Executes a chain of proxies in sequence.
 * If a proxy returns a response (e.g. redirect or auth response), execution stops and returns that response.
 * If all proxies pass (return null/void), it continues to NextResponse.next().
 */
export function createProxyChain(...proxies: CustomProxyHandler[]) {
	return async function mainProxy(request: NextRequest) {
		for (const proxy of proxies) {
			const response = await proxy(request)
			if (response) {
				return response
			}
		}
		return NextResponse.next()
	}
}
