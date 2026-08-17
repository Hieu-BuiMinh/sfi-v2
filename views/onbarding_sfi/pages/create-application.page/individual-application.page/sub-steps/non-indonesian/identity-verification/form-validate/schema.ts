import { z } from 'zod'

const fileUploadSchema = z.object({
	file: z.custom<File | null>().optional(),
	previewUrl: z.string().optional(),
	base64: z.string().optional(),
})

export const identityVerificationSchema = z.object({
	verification_document: z.literal('passport'),
	front: fileUploadSchema.refine((data) => data.file || data.previewUrl, {
		message: 'Passport is required',
	}),
	selfie: fileUploadSchema.refine((data) => data.file || data.previewUrl, {
		message: 'Selfie with passport is required',
	}),
})

export type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>
