import { z } from 'zod'

export const depositFormSchema = z.object({
  customerInformation: z.object({
    customerName: z.string(),
    tradingAccountNumber: z.string(),
  }),
  beneficiaryInformation: z.object({
    beneficiaryBankId: z.string().min(1, 'Please select a beneficiary bank'),
    beneficiaryBankLabel: z.string(),
    beneficiaryName: z.string().min(1, 'Beneficiary name is required'),
    beneficiaryAccountNumber: z.string().min(1, 'Account number is required'),
    bankCode: z.string(),
    swiftCode: z.string(),
  }),
  transferInstructions: z.object({
    amount: z.number().positive('Amount must be a positive number'),
    currency: z.string().min(1, 'Currency is required'),
    paymentDetails: z.string().min(1, 'Payment details are required'),
  }),
  proofOfDeposit: z
    .object({
      file: z.any(),
      previewUrl: z.string(),
      base64: z.string(),
    })
    .nullable()
    .optional(),
})

export type DepositFormValues = z.infer<typeof depositFormSchema>
