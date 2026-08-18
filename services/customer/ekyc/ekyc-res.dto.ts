export interface PrivyKtpData {
	nik: string
	nama?: string
	tanggal_lahir?: string
	tgl_lahir?: string
	kewarganegaraan?: string
	alamat?: string
	rt_rw?: string
	kelurahan?: string
	kecamatan?: string
	provinsi?: string
	kota?: string
	status_perkawinan?: string
	jenis_kelamin?: string
}

export interface PrivyOcrResponse {
	attempt_id?: string
	data?: unknown
}

export interface PrivyOcrBalanceResponse {
	[key: string]: unknown
}

export interface LivenessStartData {
	user_landing_url?: string
	data?: LivenessStartData
}

export interface LivenessStartResponse extends LivenessStartData {
	success?: boolean
	data?: LivenessStartData
}

export interface LivenessCallbackResponse {
	[key: string]: unknown
}
