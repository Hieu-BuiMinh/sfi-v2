export enum OcrJobStatus {
	AwaitingFile = 'awaiting_file',
	Pending = 'pending',
	Processing = 'processing',
	Successful = 'successful',
	Failed = 'failed',
}

export interface OcrHealthResponse {
	status: string
}

export interface CreateOcrJobResponse {
	id: string
}

export interface OcrStructuredAddress {
	city?: string
	district?: string
	province?: string
	postalCode?: string
	streetAddress?: string
	country?: string
}

export interface OcrStructuredResult {
	address?: OcrStructuredAddress
	dateOfBirth?: string
	dateOfExpiry?: string
	gender?: string
	idNumber?: string
	passportNumber?: string
	maritalStatus?: string
	name?: string
	country?: string
	nationality?: string
	occupation?: string
	placeOfBirth?: string
	religion?: string
	kpp?: string
	nik?: string
	taxNumber?: string
}

export interface OcrJobResult {
	page_num: number
	ocr_text: string
	doc_type: string
	doc_lang: string
	structured?: OcrStructuredResult
	schema_version: string
	ocr_text_ms: number
	doc_type_ms: number
	doc_lang_ms: number
	structured_ms: number
}

export interface OcrJobResponse {
	id: string
	status: OcrJobStatus
	results?: OcrJobResult[]
	updated_at?: string
}

export interface DeleteOcrJobResponse {
	success: boolean
}
