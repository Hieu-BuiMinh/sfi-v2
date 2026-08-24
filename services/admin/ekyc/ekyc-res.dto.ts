export interface TPrivyEkycAttempt {
	id: string
	user_email: string
	application_id: string
	privy_id: string | null
	reject_reason: string | null
	processed_by: string | null
	action_source: string | null
	verified_at: string | null
	attempt: number
	max_attempt_limit: number
	created_at: string
	updated_at: string
}

export interface TPrivyEkycStatus {
	status: string
	privy_id: string | null
	reject_reason: string | null
	raw_reject_reason: string | null
	verified_at: string | null
	latest_attempt: TPrivyEkycAttempt | null
	total_attempts: number
	ktp_image: string | null
	selfie_image: string | null
}

export interface TPrivyEkycStatusResponse {
	success: boolean
	status: number
	data: TPrivyEkycStatus
}

export interface TPrivyCheckStatusData {
	reference_number: string
	channel_id: string
	register_token: string
	status: string
	reject_reason: {
		code: string
		reason: string
	} | null
	resend: boolean
}

export interface TPrivyCheckStatusResponse {
	success: boolean
	status: number
	data: {
		message: string
		data: TPrivyCheckStatusData
	}
}

export interface TPrivyResendResponse {
	success: boolean
	message: string
}

export interface TPrivyOverrideStatusResponse {
	success: boolean
	message: string
	data: {
		status: string
		reason: string | null
	}
}
