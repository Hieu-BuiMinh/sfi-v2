/* eslint-disable @typescript-eslint/no-explicit-any */
// https://s-yadav.github.io/react-number-format/docs/intro

import React from 'react'
import { NumericFormat, NumericFormatProps, PatternFormat, PatternFormatProps } from 'react-number-format'
import { TextFieldProps } from '@mui/material'
import { StyledTextField } from '@/components/inputs/sfi-textfield'
import { TCurrency } from '@/utils/money'

export type BaseNumericProps = Omit<NumericFormatProps<TextFieldProps>, 'customInput' | 'name' | 'defaultValue'>
export type BasePatternProps = Omit<PatternFormatProps<TextFieldProps>, 'customInput' | 'name' | 'defaultValue'>

export type SfiNumberInputProps = (
	(BaseNumericProps & { format?: never }) | (BasePatternProps & { format: string })
) & {
	currency?: TCurrency
	digits?: number
	name?: string
	defaultValue?: any
}

// Default digits based on currency from money.ts logic
const DEFAULT_CURRENCY_DIGITS: Record<string, number> = {
	USD: 2,
	EUR: 2,
	GBP: 2,
	AUD: 2,
	CAD: 2,
	SGD: 2,
	THB: 2,
	CNY: 2,
	TWD: 2,
	VND: 0, // VND usually 0 in practice
	JPY: 0,
	KRW: 0,
}

const CURRENCY_SYMBOL: Record<string, string> = {
	USD: '$',
	EUR: '€',
	GBP: '£',
	JPY: '¥',
	KRW: '₩',
	CNY: '¥',
	VND: '₫',
	TWD: 'NT$',
	SGD: 'S$',
	THB: '฿',
	AUD: 'A$',
	CAD: 'C$',
}

export const SfiNumberInput = React.forwardRef<HTMLInputElement, SfiNumberInputProps>(
	({ currency, digits, ...props }, ref) => {
		const resolvedDigits = digits ?? (currency ? DEFAULT_CURRENCY_DIGITS[currency] : undefined)
		const symbol = currency ? CURRENCY_SYMBOL[currency] : undefined

		if (props.format) {
			return (
				<PatternFormat
					fullWidth
					variant="outlined"
					{...(props as any)}
					getInputRef={ref}
					customInput={StyledTextField}
				/>
			)
		}

		return (
			<NumericFormat
				fullWidth
				variant="outlined"
				thousandSeparator={true}
				decimalScale={resolvedDigits}
				fixedDecimalScale={resolvedDigits !== undefined && resolvedDigits > 0}
				prefix={symbol ? `${symbol} ` : undefined}
				{...(props as any)}
				getInputRef={ref}
				customInput={StyledTextField}
			/>
		)
	}
)

SfiNumberInput.displayName = 'SfiNumberInput'

export default SfiNumberInput
