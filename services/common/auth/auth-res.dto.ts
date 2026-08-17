export interface CheckVerificationResponse {
	authenticated: boolean
	verified: boolean
	user?: {
		name?: string
		email?: string
		email_verified?: boolean
		sub?: string
		[key: string]: unknown
	}
	error?: string
}

export interface ResendVerificationResponse {
	success?: boolean
	message?: string
	error?: string
}
