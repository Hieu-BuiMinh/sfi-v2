import { z } from 'zod'

export enum TaxResidencyOption {
	ID_ONLY = 'only Indo',
	US_ONLY = 'only Us',
	NEITHER = 'other',
}

export const jurisdictionRowSchema = z
	.object({
		tax_resident: z.string().nullable().optional(),
		tin: z.string().nullable().optional(),
		type_of_tin: z.string().nullable().optional(),
		reason_description: z.string().nullable().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.type_of_tin === 'B' && !data.reason_description?.trim()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Reason description is required when selecting Reason B',
				path: ['reason_description'],
			})
		}
	})

export const taxComplianceSchema = z
	.object({
		customer_name: z.string().min(1, 'This field is required'),
		register_address: z.string().min(1, 'This field is required'),
		resident_contry: z.nativeEnum(TaxResidencyOption),
		resident_detail: z.object({
			first: jurisdictionRowSchema,
			second: jurisdictionRowSchema,
			third: jurisdictionRowSchema,
		}),
	})
	.superRefine((data, ctx) => {
		if (data.resident_contry === TaxResidencyOption.ID_ONLY) return

		const rows = [
			{ row: data.resident_detail.first, key: 'first' },
			{ row: data.resident_detail.second, key: 'second' },
			{ row: data.resident_detail.third, key: 'third' },
		] as const

		rows.forEach(({ row, key }, index) => {
			const hasCountry = !!row.tax_resident?.trim()
			const hasTin = !!row.tin?.trim()
			const hasReason = !!row.type_of_tin?.trim()

			if (index > 0 && !hasCountry && !hasTin && !hasReason) return

			if (!hasCountry) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: index === 0 ? 'At least 1 record is required' : 'Country is required',
					path: ['resident_detail', key, 'tax_resident'],
				})
			}

			if (!hasTin && !hasReason) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Please provide a TIN or select a reason',
					path: ['resident_detail', key, 'tin'],
				})
			}
		})
	})

export type TaxComplianceFormData = z.infer<typeof taxComplianceSchema>
