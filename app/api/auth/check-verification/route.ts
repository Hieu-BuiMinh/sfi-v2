import { NextResponse } from 'next/server'
import { getAuth0ByHost } from '@/lib/auth0'
import { auth0Config } from '@/lib/auth0/auth0-variables'

export async function GET(request: Request) {
	try {
		const host = request.headers.get('host') || 'localhost:3000'
		const auth0Client = await getAuth0ByHost(host)

		const session = await auth0Client.getSession()

		if (!session || !session.user) {
			return NextResponse.json({ authenticated: false, verified: false }, { status: 401 })
		}

		const userId = session.user.sub
		const hostKey = host || 'localhost:3000'
		const config = auth0Config[hostKey] || auth0Config['localhost:3000']

		const domain = config?.domain
		const clientId = config?.clientId
		const clientSecret = config?.clientSecret

		let isVerified = !!session.user.email_verified

		// Real-time check via Auth0 Management API to bypass stale Cookie Session
		if (!isVerified && domain && clientId && clientSecret && userId) {
			try {
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

				if (!tokenRes.ok) {
					const tokenErr = await tokenRes.text()
					console.error('[check-verification] Mgmt Token error:', tokenRes.status, tokenErr)
				} else {
					const tokenData = await tokenRes.json()
					const mgmtToken = tokenData.access_token

					const userRes = await fetch(`https://${domain}/api/v2/users/${encodeURIComponent(userId)}`, {
						headers: {
							authorization: `Bearer ${mgmtToken}`,
						},
					})

					if (!userRes.ok) {
						const userErr = await userRes.text()
						console.error('[check-verification] Get User error:', userRes.status, userErr)
					} else {
						const userData = await userRes.json()
						console.log(
							'[check-verification] Real-time email_verified from Auth0:',
							userData.email_verified
						)
						isVerified = !!userData.email_verified

						if (isVerified && !session.user.email_verified) {
							await auth0Client.updateSession({
								...session,
								user: {
									...session.user,
									email_verified: true,
								},
							})
							console.log('[check-verification] Session updated with email_verified: true')
						}
					}
				}
			} catch (err) {
				console.error('Management API check failed:', err)
			}
		}

		return NextResponse.json(
			{
				authenticated: true,
				verified: isVerified,
				user: {
					...session.user,
					email_verified: isVerified,
				},
			},
			{
				headers: {
					'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
				},
			}
		)
	} catch (error: any) {
		return NextResponse.json({ error: error.message || 'Error checking status' }, { status: 500 })
	}
}
