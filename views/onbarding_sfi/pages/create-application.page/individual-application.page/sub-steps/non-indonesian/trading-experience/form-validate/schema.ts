import { z } from 'zod'

export const tradingExperienceSchema = z
	.object({
		investment_objectives: z.string().min(1, 'Investment objectives is required'),
		experience_in_trading: z.enum(['yes', 'no'], {
			required_error: 'Trading experience is required',
		}),
		year_of_tradding: z.string().optional(),
		trading_acknowledgement: z.boolean(),
	})
	.superRefine((data, ctx) => {
		if (data.experience_in_trading === 'yes' && !data.year_of_tradding) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please choose trading experience',
				path: ['year_of_tradding'],
			})
		}

		if (data.experience_in_trading === 'no' && !data.trading_acknowledgement) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Trading acknowledgement is required',
				path: ['trading_acknowledgement'],
			})
		}
	})

export type TradingExperienceFormData = z.infer<typeof tradingExperienceSchema>

export const INVESTMENT_OBJECTIVES_OPTIONS = [
	{ value: 'Long-Term Investment (Buy and Hold)', label: 'Long-Term Investment (Buy and Hold)' },
	{ value: 'Short-Term / Active Trading', label: 'Short-Term / Active Trading' },
	{ value: 'Hedging / Risk Management', label: 'Hedging / Risk Management' },
	{ value: 'Speculation', label: 'Speculation' },
	{ value: 'Portfolio Diversification', label: 'Portfolio Diversification' },
	{ value: 'Capital Preservation', label: 'Capital Preservation' },
]

export const TRADING_EXPERIENCE_OPTIONS = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' },
]

export const YEARS_OF_TRADING_OPTIONS = [
	{ value: 'Under 1 Year', label: 'Under 1 Year' },
	{ value: 'From 1 to 3 Years', label: 'From 1 to 3 Years' },
	{ value: 'From 3 to 5 Years', label: 'From 3 to 5 Years' },
	{ value: 'About 5 Years', label: 'About 5 Years' },
]
