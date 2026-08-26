export type TermOfUsePdfResponse = Blob

export interface TLegalDocumentTemplateVersion {
	id: string
	legal_document_template_id: string
	slug: string
	etag: string
	s3_bucket: string
	s3_key: string
	last_modified_at: string
	size: string
	s3_version_id: string
	version: string
	created_at: number
	updated_at: number
	deleted_at: string | null
}

export interface TLegalDocumentTemplate {
	id: string
	name: string
	slug: string
	created_at: string
	updated_at: string
	deleted_at: string | null
	size: string
	s3_versions: TLegalDocumentTemplateVersion[]
}

export interface TInitLegalDocumentChunkedUploadResponse {
	uploadId: string
	chunkSize: number
	totalChunks: number
}

export interface TUploadLegalDocumentChunkResponse {
	chunkIndex: number
	success: boolean
}

export interface TLegalDocumentChunkedUploadStatusResponse {
	uploadId: string
	uploaded: number[]
	totalChunks: number
	status: string
	filename: string
}

export interface TCompleteLegalDocumentChunkedUploadResponse {
	path: string
	filename: string
	size: number
	mimeType: string
}
