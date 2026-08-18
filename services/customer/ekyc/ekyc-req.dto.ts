export type EkycLanguage = 'en' | 'id'

export interface PrivyOcrRequest {
	file: File
	attemptId?: string
	reverifyToken?: string
	signal?: AbortSignal
}

export interface StartLivenessRequest {
	attemptId: string
	language: EkycLanguage
}

export interface LivenessPayload {
	[key: string]: unknown
}

export interface LivenessCallbackRequest {
	payload: LivenessPayload
	attempt_id: string | null
}
