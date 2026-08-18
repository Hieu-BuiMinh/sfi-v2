import { z } from 'zod'

const fileUploadSchema = z.object({
	file: z.custom<File | null>().optional(),
	previewUrl: z.string().optional(),
	base64: z.string().optional(),
})

export const identityVerificationSchema = z.object({
	verification_document: z.enum(['ktp', 'passport']),
	front: fileUploadSchema.refine((data) => data.file || data.previewUrl, {
		message: 'Front side is required',
	}),
	selfie: fileUploadSchema.refine((data) => data.file || data.previewUrl, {
		message: 'Selfie is required',
	}),
	npwp_photo: fileUploadSchema.refine((data) => data.file || data.previewUrl, {
		message: 'NPWP photo is required',
	}),
})

export type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>
