import { z } from 'zod'
import { useTranslations } from 'next-intl'

type PaymentInstructionTranslator = ReturnType<typeof useTranslations>

const nonEmptyString = (t: PaymentInstructionTranslator, key: string, label: string) =>
  z
    .string()
    .trim()
    .min(1, t(`validation.${key}_required`, { label }))

export const getPaymentInstructionSchema = (t: PaymentInstructionTranslator) =>
  z
    .object({
      account_type: z
        .string()
        .trim()
        .min(1, t('validation.account_type_required')),
      status: z
        .union([z.boolean(), z.literal('0'), z.literal('1')])
        .transform((val) => (val === true || val === '1' ? '1' : '0')),

      currency: nonEmptyString(t, 'currency', 'Currency'),
      bank_id: nonEmptyString(t, 'bank', 'Bank'),
      entity_id: nonEmptyString(t, 'entity', 'Entity'),
      user_id: nonEmptyString(t, 'user', 'User'),

      method: z.coerce.number().pipe(z.union([z.literal(1), z.literal(2)])),

      beneficiary_account_name: nonEmptyString(
        t,
        'beneficiary_name',
        'Beneficiary account name'
      ),
      beneficiary_account_number: nonEmptyString(
        t,
        'beneficiary_number',
        'Beneficiary account number'
      ),
      beneficiary_bank_branch_name: nonEmptyString(
        t,
        'branch',
        'Beneficiary bank branch name'
      ),

      bank_code: z.string().trim().optional().default(''),

      beneficiary_bank_address: z.string().trim().optional().default(''),
      beneficiary_swift_code: z.string().trim().optional().default(''),

      correspondent_bank_name: z.string().trim().optional().default(''),
      correspondent_account_number: z.string().trim().optional().default(''),
      correspondent_swift_code: z.string().trim().optional().default(''),
    })
    .superRefine((data, ctx) => {
      if (!data.bank_code?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bank_code'],
          message: t('validation.bank_code_required'),
        })
      }

      if (data.method === 1) {
        if (!data.beneficiary_bank_address?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['beneficiary_bank_address'],
            message: t('validation.bank_address_required_wire'),
          })
        }

        if (!data.beneficiary_swift_code?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['beneficiary_swift_code'],
            message: t('validation.swift_code_required_wire'),
          })
        }
      }
    })

export type PaymentInstructionFormValues = z.output<ReturnType<typeof getPaymentInstructionSchema>>

export type PaymentInstructionFormInput = z.input<ReturnType<typeof getPaymentInstructionSchema>>
