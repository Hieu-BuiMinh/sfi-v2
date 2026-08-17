import { z } from 'zod'

const fileUploadSchema = z.object({
	file: z.custom<File | null>().optional(),
	previewUrl: z.string().optional(),
	base64: z.string().optional(),
})

export const identityVerificationSchema = z.object({
	verification_document: z.enum(['ktp', 'passport']),
	ktp_or_passport: z.string().min(1, 'KTP or Passport number is required'),
	front: fileUploadSchema.refine((data) => data.file || data.previewUrl, {
		message: 'Front side is required',
	}),
	selfie: fileUploadSchema.refine((data) => data.file || data.previewUrl, {
		message: 'Selfie is required',
	}),
	npwp_number: z
		.string()
		.min(1, 'NPWP number is required')
		.refine((val) => val.replace(/\D/g, '').length === 15, 'NPWP must be 15 digits'),
	npwp_photo: fileUploadSchema.refine((data) => data.file || data.previewUrl, {
		message: 'NPWP photo is required',
	}),
})

export type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>
