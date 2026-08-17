import { z } from 'zod'

export const corporateApplicationSchema = z.object({
	company_name: z.string().min(1, 'Company name is required'),
	country_of_incorporation: z.string().min(1, 'Country of incorporation is required'),
	business_registration_number: z.string().optional(),
	nature_of_business: z.string().min(1, 'Nature of business is required'),
	business_address: z.string().optional(),
	estimated_annual_revenue: z.string().optional(),
	contact_full_name: z.string().min(1, 'Full name is required'),
	contact_position: z.string().min(1, 'Position or title is required'),
	contact_email: z.string().min(1, 'Email address is required').email('Email address is invalid'),
	contact_phone: z.string().min(1, 'Phone number is required'),
	preferred_contact_method: z.string().min(1, 'Preferred contact method is required'),
})

export type CorporateApplicationFormData = z.infer<typeof corporateApplicationSchema>

export const NATURE_OF_BUSINESS_OPTIONS = [
	{ value: 'financial_services', label: 'Financial Services' },
	{ value: 'trading', label: 'Trading' },
	{ value: 'manufacturing', label: 'Manufacturing' },
	{ value: 'technology', label: 'Technology' },
	{ value: 'real_estate', label: 'Real Estate' },
	{ value: 'retail', label: 'Retail' },
	{ value: 'healthcare', label: 'Healthcare' },
	{ value: 'education', label: 'Education' },
	{ value: 'other', label: 'Other' },
]

export const ANNUAL_REVENUE_OPTIONS = [
	{ value: 'below_100k', label: '< $100,000' },
	{ value: '100k_500k', label: '$100,000 - $500,000' },
	{ value: '500k_1m', label: '$500,000 - $1,000,000' },
	{ value: '1m_5m', label: '$1,000,000 - $5,000,000' },
	{ value: 'above_5m', label: '> $5,000,000' },
]

export const PREFERRED_CONTACT_METHOD_OPTIONS = [
	{ value: 'whatsapp', label: 'WhatsApp' },
	{ value: 'email', label: 'Email' },
	{ value: 'phone', label: 'Call' },
]
