export enum OcrDocumentType {
	IdCard = 'id-card',
	Passport = 'passport',
	Npwp = 'npwp',
}

export interface CreateOcrJobRequest {
	refId: string
	docId: string
	docType: OcrDocumentType
	issuingCountry: string | null
	docLang: string | null
}

export interface OcrJobRequest {
	jobId: string
	signal?: AbortSignal
}

export interface AttachOcrJobFileRequest extends OcrJobRequest {
	file: File
}
