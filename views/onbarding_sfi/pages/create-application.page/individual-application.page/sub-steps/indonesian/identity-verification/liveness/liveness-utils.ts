import { EkycLanguage, LivenessPayload, LivenessStartResponse } from '@/services/customer/ekyc'

const LIVENESS_ERROR_MESSAGES: Record<string, string> = {
	FALSE: 'Liveness verification failed',
	'EYES-CLOSED': 'Eyes Closed',
	'FACE-NOT-DETECTED': 'Face not detected',
	'MISALIGNED-FACE': 'Misaligned face',
	'FACE-NOT-WITHIN-CIRCLE': 'Face is not within the circle',
	'FACE-TOO-FAR': 'Face is too far',
	'FACE-TOO-CLOSE': 'Face is too close',
	'FACE-TOO-BRIGHT': 'Face too bright',
	'FACE-TOO-DARK': 'Face too dark',
	'TWO-FACES-DETECTED': 'There are two faces',
}

export function getLivenessLandingUrl(response: LivenessStartResponse): string | undefined {
	return response.user_landing_url || response.data?.user_landing_url || response.data?.data?.user_landing_url
}

export function addLivenessLanguage(url: string, language: EkycLanguage) {
	const landingUrl = new URL(url)

	for (const parameter of ['lang', 'locale', 'language', 'hl']) {
		landingUrl.searchParams.set(parameter, language)
	}

	return landingUrl.toString()
}

export function extractLivenessPayload(value: unknown): LivenessPayload | undefined {
	if (!value || typeof value !== 'object') return undefined

	const root = value as Record<string, unknown>
	const rootData = root.data

	if (rootData && typeof rootData === 'object') {
		const data = rootData as Record<string, unknown>

		if (data.source === 'privypass_liveness' && data.data && typeof data.data === 'object') {
			return data.data as LivenessPayload
		}

		if (root.source === 'privypass_liveness') return data as LivenessPayload
	}

	if ('fc_token' in root || 'result' in root) return root as LivenessPayload
}

export function getLivenessFaceImage(payload: LivenessPayload): string | undefined {
	const usedFace = typeof payload.used_face === 'string' ? payload.used_face : 'face_1'
	const faceImage = payload[usedFace] || payload.face_1 || payload.face_2

	return typeof faceImage === 'string' && faceImage.startsWith('data:image') ? faceImage : undefined
}

export function getLivenessResult(payload: LivenessPayload) {
	const result = typeof payload.result === 'string' ? payload.result.toUpperCase() : undefined

	return {
		isSuccessful: result === 'TRUE' || result === 'SUCCESS',
		message: result ? LIVENESS_ERROR_MESSAGES[result] || 'Liveness verification failed' : undefined,
	}
}

export async function createLivenessFile(dataUrl: string) {
	const blob = await fetch(dataUrl).then((response) => response.blob())
	return new File([blob], 'liveness_selfie.jpg', { type: blob.type || 'image/jpeg' })
}
