/* eslint-disable @typescript-eslint/no-explicit-any */

import { TApiResponse } from '@/dto/types/api.type'

export interface TKycDocument {
	id: string
	type_id: string
	type_slug: string
	path: string | null
	s3_url: string | null
	content: any
	application_id: string
	submitted_at: number
	created_at: number
	status?: string
}

export type TKycDocumentsResponse = TApiResponse<TKycDocument[]>

export interface TUserKycDocumentsResponse extends TApiResponse<TKycDocument[]> {
	facial_proof?: string | null
	is_ekyc_status?: string | null
	is_ekyc?: number | null
}

export interface TVerifyKycResponse {
	success: boolean
	message: string
	data: {
		url: string
		reference: string
	}
}

export interface TCheckFacialStatusResponse {
	status: string
	data:
		| {
				url?: string
				[key: string]: any
		  }
		| any[]
}

export interface TFacialVerifyResponse {
	data: {
		url: string
	}
}
