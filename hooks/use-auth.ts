import { useUser, getAccessToken } from '@auth0/nextjs-auth0/client'

export function useAuth() {
	const { user, error, isLoading } = useUser()

	/**
	 * Fetches the Access Token for API calls.
	 * Calls /auth/access-token endpoint under the hood.
	 */
	const getToken = async (audience?: string) => {
		try {
			return await getAccessToken({ audience })
		} catch (err) {
			console.error('Failed to get access token:', err)
			return null
		}
	}

	return {
		auth: user,
		error,
		isLoading,
		isAuthenticated: !!user,
		getAccessToken: getToken,
	}
}
