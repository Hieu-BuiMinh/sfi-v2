import { z } from 'zod'

export const jobInformationSchema = z.object({
	type_job: z.string().min(1, 'Type of job is required'),
	company_line_of_business: z.string().min(1, 'Company line of business is required'),
	company_job_title: z.string().min(1, 'Job title is required'),
	company_name: z.string().min(1, 'Company name is required'),
	company_address: z.string().min(1, 'Company address is required').min(10, 'Address must be at least 10 characters'),
	company_village: z.string().optional(),
	company_sub_district: z.string().optional(),
	company_city: z.string().min(1, 'City is required'),
	company_province: z.string().optional(),
	company_postal_code: z.string().min(1, 'Postal code is required'),
	company_country: z.string().optional(),
	length_of_work: z.coerce.number().optional(),
	annual_income: z.string().min(1, 'Annual income is required'),
	source_of_fund: z.string().min(1, 'Source of funds is required'),
	source_of_fund_other: z.string().optional(),
	source_of_fund_other_specify: z.string().optional(),
})

export type JobInformationFormData = z.infer<typeof jobInformationSchema>

export const TYPE_OF_JOB_OPTIONS = [
	{ value: 'Employee, private company', label: 'Employee, private company' },
	{ value: 'Employee, public sector company', label: 'Employee, public sector company' },
	{
		value: 'Private company, Member of Board of Directors or Executive',
		label: 'Private company, Member of Board of Directors or Executive',
	},
	{
		value: 'Public sector/state, Member of Board of Directors or Executive',
		label: 'Public sector/state, Member of Board of Directors or Executive',
	},
	{ value: 'Political/Public office', label: 'Political/Public office' },
	{ value: 'Self employed', label: 'Self employed' },
	{ value: 'Retired', label: 'Retired' },
	{ value: 'Student', label: 'Student' },
	{ value: 'Unemployed', label: 'Unemployed' },
]

export const COMPANY_LINE_OF_BUSINESS_OPTIONS = [
	{ value: 'Finance', label: 'Financial' },
	{ value: 'Technology', label: 'Technology' },
	{ value: 'Hospitality', label: 'Hospitality' },
	{ value: 'Logistics', label: 'Logistics' },
	{ value: 'Trading', label: 'Trading' },
	{ value: 'Property', label: 'Property' },
	{ value: 'Energy', label: 'Energy' },
	{ value: 'Education', label: 'Education' },
	{ value: 'Retail', label: 'Retail' },
	{ value: 'Consulting', label: 'Consulting' },
	{ value: 'Others', label: 'Others' },
]

export const ANNUAL_INCOME_OPTIONS = [
	{ value: 'between-IDR100million-250million', label: 'Between IDR 100 million - 250 million' },
	{ value: 'between-IDR250million-500million', label: 'Between IDR 250 million - 500 million' },
	{ value: 'above-IDR500million', label: 'Above IDR 500 million' },
]

export const SOURCE_OF_FUNDS_OPTIONS = [
	{ value: 'Savings from salary/pension', label: 'Savings from salary/pension' },
	{ value: 'Inheritance', label: 'Inheritance' },
	{ value: 'Business profits', label: 'Business profits' },
	{ value: 'Royalties', label: 'Royalties' },
	{ value: 'Gifts/Donations', label: 'Gifts/Donations' },
	{ value: 'Others', label: 'Others' },
]
