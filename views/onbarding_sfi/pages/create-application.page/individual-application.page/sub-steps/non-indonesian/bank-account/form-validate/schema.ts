import { z } from 'zod'

export const bankAccountSchema = z.object({
	bank_branch_name: z.string().min(1, 'Bank name is required'),
	full_name: z.string().min(1, 'Full name is required'),
	account_number: z
		.string()
		.min(1, 'Account number is required')
		.min(5, 'Account number must be at least 5 characters'),
	swift_bic_code: z.string().min(1, 'SWIFT/BIC code is required'),
	bank_branch_address: z.string().min(1, 'Bank branch address is required'),
})

export type BankAccountFormData = z.infer<typeof bankAccountSchema>
