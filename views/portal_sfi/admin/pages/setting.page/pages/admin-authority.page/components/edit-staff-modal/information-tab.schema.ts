import { z } from 'zod'

export const informationTabSchema = z.object({
  status: z.boolean(),
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be at most 100 characters'),
  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone_number: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{9,15}$/, 'Phone number must be 9-15 digits'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),
  date_of_birth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Invalid date of birth',
    })
    .refine((value) => new Date(value) <= new Date(), {
      message: 'Date of birth cannot be in the future',
    }),
  nationality: z
    .string()
    .trim()
    .min(1, 'Nationality is required')
    .max(100, 'Nationality must be at most 100 characters'),
})

export type IInformationTabValues = z.infer<typeof informationTabSchema>
