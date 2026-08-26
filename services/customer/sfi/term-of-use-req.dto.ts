export interface GetTermOfUsePdfParams {
	userId: string
	pdfType: string
	lang?: string
}

export interface TGetLegalDocumentTemplateDetailParams {
	name: string
}

export interface TInitLegalDocumentChunkedUploadRequest {
	filename: string
	filesize: number
	mimeType: string
}

export interface TUploadLegalDocumentChunkRequest {
	uploadId: string
	chunkIndex: number
	totalChunks: number
	chunk: Blob
}

export interface TGetLegalDocumentChunkedUploadStatusParams {
	uploadId: string
}

export interface TCompleteLegalDocumentChunkedUploadRequest {
	uploadId: string
}

export interface TCreateLegalDocumentTemplateRequest {
	name: string
	slug: string
	uploadId: string
}

export interface TCancelLegalDocumentChunkedUploadRequest {
	uploadId: string
}

export interface TUpdateLegalDocumentTemplateRequest {
	name: string
	slug: string
	uploadId?: string
}
