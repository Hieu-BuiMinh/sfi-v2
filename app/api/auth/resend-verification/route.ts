import { NextResponse } from 'next/server'
import { getAuth0ByHost } from '@/lib/auth0'
import { auth0Config } from '@/lib/auth0/auth0-variables'

export async function POST(request: Request) {
	try {
		const host = request.headers.get('host') || 'localhost:3000'
		const auth0Client = await getAuth0ByHost(host)
		const session = await auth0Client.getSession()

		if (!session || !session.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const hostKey = host || 'localhost:3000'
		const config = auth0Config[hostKey] || auth0Config['localhost:3000']

		const domain = config?.domain
		const clientId = config?.clientId
		const clientSecret = config?.clientSecret

		if (!domain || !clientId || !clientSecret) {
			return NextResponse.json({ error: `Auth0 configuration missing for host ${hostKey}` }, { status: 500 })
		}

		// 1. Fetch Management API Access Token
		const tokenRes = await fetch(`https://${domain}/oauth/token`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				client_id: clientId,
				client_secret: clientSecret,
				audience: `https://${domain}/api/v2/`,
				grant_type: 'client_credentials',
			}),
		})

		const tokenData = await tokenRes.json()

		if (!tokenRes.ok) {
			return NextResponse.json(
				{ error: tokenData.error_description || 'Failed to obtain Mgmt Token' },
				{ status: tokenRes.status }
			)
		}

		const mgmtToken = tokenData.access_token

		// 2. Call Auth0 Verification Email Job API
		const verifyRes = await fetch(`https://${domain}/api/v2/jobs/verification-email`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${mgmtToken}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				user_id: session.user.sub,
				client_id: clientId,
			}),
		})

		const verifyData = await verifyRes.json()

		if (!verifyRes.ok) {
			return NextResponse.json(
				{ error: verifyData.message || 'Failed to send verification email' },
				{ status: verifyRes.status }
			)
		}

		return NextResponse.json({ success: true, message: 'Verification email sent successfully' })
	} catch (error: any) {
		return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
	}
}
