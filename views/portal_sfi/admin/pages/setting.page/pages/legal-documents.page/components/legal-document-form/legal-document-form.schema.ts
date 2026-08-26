import { z } from 'zod'

const DOCX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
export const LEGAL_DOCUMENT_MAX_FILE_SIZE = 10 * 1024 * 1024

export const LEGAL_DOCUMENT_SLUGS = [
	'trading_rules_of_nano_derivative_contracts',
	'commodity_broker_profile',
	'terms_and_conditions_of_trading_platform_use',
	'electronic_online_transaction_account_opening_application',
	'risk_disclosure_statement',
	'commodity_trading_agreement',
	'customer_declaration_and_responsibility_statement',
	'statement_of_having_conducted_trading_simulation',
] as const

const documentSchema = z
	.object({
		file: z.custom<File>((value) => value instanceof File, 'Document is required'),
		previewUrl: z.string(),
		base64: z.string(),
	})
	.refine(({ file }) => file.name.toLowerCase().endsWith('.docx') && (!file.type || file.type === DOCX_MIME_TYPE), {
		message: 'Only DOCX files are accepted',
	})
	.refine(({ file }) => file.size <= LEGAL_DOCUMENT_MAX_FILE_SIZE, {
		message: 'File size must not exceed 10 MB',
	})

export const getLegalDocumentFormSchema = (isEdit: boolean) =>
	z
		.object({
			name: z.string().trim().min(1, 'Name is required'),
			slug: z
				.string()
				.min(1, 'Slug is required')
				.refine(
					(value) => LEGAL_DOCUMENT_SLUGS.includes(value as (typeof LEGAL_DOCUMENT_SLUGS)[number]),
					'Invalid slug'
				),
			document: documentSchema.nullable(),
		})
		.superRefine(({ document }, context) => {
			if (!isEdit && !document) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['document'],
					message: 'Document is required',
				})
			}
		})

export type TLegalDocumentFormValues = z.infer<ReturnType<typeof getLegalDocumentFormSchema>>
