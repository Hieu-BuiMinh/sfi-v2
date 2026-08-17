import { z } from 'zod'
import dayjs from 'dayjs'

export const personalInformationSchema = z
	.object({
		ktp_or_passport: z.string().min(1, 'Passport number is required'),
		selectedCountry: z.string().min(1, 'Nationality is required'),
		full_name: z.string().min(1, 'Full name is required').min(2, 'Full name must be at least 2 characters'),
		place_birth: z.string().min(1, 'Place of birth is required'),
		gender: z.enum(['male', 'female'], {
			required_error: 'Gender is required',
		}),
		birthday: z
			.string()
			.min(1, 'Date of birth is required')
			.refine(
				(date) => {
					const dob = dayjs(date)
					return dob.isValid() && dob.isBefore(dayjs())
				},
				{
					message: 'Date of birth must be a valid date in the past',
				}
			)
			.refine(
				(date) => {
					const dob = dayjs(date)
					const age = dayjs().diff(dob, 'year')
					return age >= 18
				},
				{
					message: 'You must be at least 18 years old',
				}
			),
		email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
		phone: z
			.string()
			.min(1, 'Phone number is required')
			.regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),

		id_address: z.string().min(1, 'Current address is required'),
		village: z.string().optional(),
		sub_district: z.string().optional(),
		city: z.string().min(1, 'City is required'),
		province: z.string().optional(),
		postal_code: z.string().min(1, 'Postal code is required'),
		country: z.string().min(1, 'Country is required'),

		// Emergency Contact
		emergency_contact_name: z.string().min(1, 'Emergency contact name is required'),
		emergency_phone: z.string().min(1, 'Emergency contact phone is required'),
		relationship_with_customer: z.string().min(1, 'Relationship with customer is required'),
		relationship_with_customer_other: z.string().optional(),
		mother_maiden_name: z.string().min(1, "Mother's maiden name is required"),
		referral_code: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.relationship_with_customer === 'Other' && !data.relationship_with_customer_other) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please specify relationship',
				path: ['relationship_with_customer_other'],
			})
		}
	})

export type PersonalInformationFormData = z.infer<typeof personalInformationSchema>

export const RELATIONSHIP_OPTIONS = [
	{ value: 'Spouse', label: 'Spouse' },
	{ value: 'Parent', label: 'Parent' },
	{ value: 'Sibling', label: 'Sibling' },
	{ value: 'Child', label: 'Child' },
	{ value: 'Father', label: 'Father' },
	{ value: 'Mother', label: 'Mother' },
	{ value: 'Other', label: 'Other' },
]
