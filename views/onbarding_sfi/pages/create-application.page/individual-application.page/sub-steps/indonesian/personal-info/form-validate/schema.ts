import { z } from 'zod'
import dayjs from 'dayjs'

export const personalInformationSchema = z
	.object({
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

		// Registered Address (KTP)
		home_address: z.string().min(1, 'Registered address is required'),
		home_address_postal_code: z.string().min(1, 'Postal code is required'),
		home_address_regency_code: z.string().min(1, 'City is required'),

		// Status
		marriage_status: z.string().min(1, 'Marriage status is required'),
		home_ownership_status: z.string().min(1, 'Home ownership status is required'),

		// Current Address
		current_address: z.string().min(1, 'Current address is required'),
		current_address_postal_code: z.string().min(1, 'Postal code is required'),
		current_address_regency_code: z.string().min(1, 'City is required'),

		// Emergency Contact
		emergency_contact_name: z.string().min(1, 'Emergency contact name is required'),
		emergency_phone: z.string().min(1, 'Emergency contact phone is required'),
		relationship_with_customer: z.string().min(1, 'Relationship with customer is required'),
		relationship_with_customer_other: z.string().optional(),
		mother_maiden_name: z.string().min(1, "Mother's maiden name is required"),
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

export const MARRIAGE_STATUS_OPTIONS = [
	{ value: 'Single', label: 'Single' },
	{ value: 'Married', label: 'Married' },
	{ value: 'Widowed', label: 'Widowed' },
	{ value: 'Divorced', label: 'Divorced' },
]

export const HOME_OWNERSHIP_OPTIONS = [
	{ value: 'Owned', label: 'Owned' },
	{ value: 'Rented', label: 'Rented' },
	{ value: 'Family House', label: 'Family House' },
	{ value: 'Others', label: 'Others' },
]

export const RELATIONSHIP_OPTIONS = [
	{ value: 'Spouse', label: 'Spouse' },
	{ value: 'Parent', label: 'Parent' },
	{ value: 'Sibling', label: 'Sibling' },
	{ value: 'Child', label: 'Child' },
	{ value: 'Father', label: 'Father' },
	{ value: 'Mother', label: 'Mother' },
	{ value: 'Other', label: 'Other' },
]
