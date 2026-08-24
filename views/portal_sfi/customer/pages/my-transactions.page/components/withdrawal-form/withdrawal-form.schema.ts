import { z } from 'zod'

export const withdrawalFormSchema = z.object({
  customerInformation: z.object({
    customerName: z.string(),
    tradingAccountNumber: z.string(),
  }),
  beneficiaryInformation: z.object({
    bankId: z.string().min(1, 'Please select a bank'),
    bankName: z.string(),
    beneficiaryName: z.string().min(1, 'Beneficiary name is required'),
    beneficiaryAccountNumber: z.string().min(1, 'Account number is required'),
  }),
  transferInformation: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
    currency: z.string().min(1, 'Please select a currency'),
    equivalentAmount: z.number().optional(),
    paymentDetails: z.string().min(1, 'Payment details are required'),
  }),
})

export type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>
