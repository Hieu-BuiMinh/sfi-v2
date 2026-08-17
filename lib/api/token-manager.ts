import { getAccessToken } from '@auth0/nextjs-auth0/client'

/**
 * TokenManager handles in-memory token caching and request deduplication
 * for Client-side (Direct Non-BFF) mode, preventing redundant calls to /api/auth/access-token.
 */
class TokenManager {
	private token: string | null = null
	private tokenExpiry: number | null = null
	private fetchPromise: Promise<string | null> | null = null

	async getToken(): Promise<string | null> {
		// 1. If valid cached token exists in memory, reuse it immediately (0 network calls)
		if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
			return this.token
		}

		// 2. If a token fetch request is already in-flight, reuse that exact promise
		if (this.fetchPromise) {
			return this.fetchPromise
		}

		this.fetchPromise = (async () => {
			try {
				const token = await getAccessToken()
				if (typeof token === 'string' && token) {
					this.token = token
					// Cache token for 50 minutes (3000 seconds) to safely refresh before standard 1-hour expiration
					this.tokenExpiry = Date.now() + 3000 * 1000
					return token
				}
				this.clearToken()
				return null
			} catch {
				this.clearToken()
				return null
			} finally {
				this.fetchPromise = null
			}
		})()

		return this.fetchPromise
	}

	clearToken() {
		this.token = null
		this.tokenExpiry = null
	}
}

export const tokenManager = new TokenManager()
