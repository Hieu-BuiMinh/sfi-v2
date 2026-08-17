import numeral from 'numeral'

export type TCurrency = 'USD' | 'VND' | 'EUR' | 'GBP' | 'JPY' | 'KRW' | 'CNY' | 'TWD' | 'SGD' | 'THB' | 'AUD' | 'CAD'

type TFormatMoneyOptions = {
	currency?: TCurrency
	locale?: 'en' | 'vi'
	digits?: number | string // override decimals
	useSymbol?: boolean // $, ₫, ¥...
	showCode?: boolean // USD, VND...
	spaceBetween?: boolean // "1,000 USD" vs "1,000USD"
	compact?: boolean // 1.2k / 1.2m
	trimZeros?: boolean // 1.00 -> 1
	fallback?: string
}

// default decimals per currency (common ISO practice)
const DEFAULT_CURRENCY_DIGITS: Record<TCurrency, number> = {
	USD: 2,
	EUR: 2,
	GBP: 2,
	AUD: 2,
	CAD: 2,
	SGD: 2,
	THB: 2,
	CNY: 2,
	TWD: 2,

	VND: 2,
	JPY: 0,
	KRW: 0,
}

const CURRENCY_SYMBOL: Partial<Record<TCurrency, string>> = {
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

function resolveDigits(currency?: TCurrency, digits?: number | string) {
	if (digits === null || digits === undefined) {
		return currency ? (DEFAULT_CURRENCY_DIGITS[currency] ?? 2) : 2
	}

	if (typeof digits === 'number') {
		return Number.isFinite(digits)
			? Math.max(0, Math.trunc(digits))
			: currency
				? (DEFAULT_CURRENCY_DIGITS[currency] ?? 2)
				: 2
	}

	const raw = String(digits).trim()
	if (!raw) {
		return currency ? (DEFAULT_CURRENCY_DIGITS[currency] ?? 2) : 2
	}

	if (raw.toLowerCase() === 'auto') {
		return currency ? (DEFAULT_CURRENCY_DIGITS[currency] ?? 2) : 2
	}

	const parsed = Number(raw)
	if (Number.isFinite(parsed)) {
		return Math.max(0, Math.trunc(parsed))
	}

	// fallback
	return currency ? (DEFAULT_CURRENCY_DIGITS[currency] ?? 2) : 2
}

function buildNumeralFormat(digits: number, compact?: boolean, trimZeros?: boolean) {
	// numeral format:
	// - "0,0.00" => thousands separators + fixed decimals
	// - "0,0.[00]" => optional decimals (trimZeros)
	// - "0,0.00a" => compact (k/m/b)
	const dec = digits > 0 ? (trimZeros ? `.[${'0'.repeat(digits)}]` : `.${'0'.repeat(digits)}`) : ''
	const suffix = compact ? 'a' : ''
	return `0,0${dec}${suffix}`
}

export function formatMoney(value: number | string | null | undefined, opts: TFormatMoneyOptions = {}) {
	const {
		currency,
		locale = 'en',
		digits,
		useSymbol = false,
		showCode = false,
		spaceBetween = true,
		compact = false,
		trimZeros = false,
		fallback = '--',
	} = opts

	if (value === null || value === undefined || value === '') return fallback

	const num = typeof value === 'string' ? Number(value) : value
	if (!Number.isFinite(num)) return fallback

	numeral.locale(locale)

	const d = resolveDigits(currency, digits)
	const fmt = buildNumeralFormat(d, compact, trimZeros)
	const formatted = numeral(num).format(fmt)

	const symbol = currency ? CURRENCY_SYMBOL[currency] : undefined
	const code = currency

	// Compose prefix/suffix:
	// Common UI patterns:
	// - useSymbol: "$ 1,000" / "₫ 1,000"
	// - showCode:  "1,000 USD"
	if (useSymbol && symbol) {
		// Symbol usually prefix; VND in VN sometimes suffix but UI fintech hay prefix.
		return `${symbol}${spaceBetween ? ' ' : ''}${formatted}`
	}

	if (showCode && code) {
		return `${formatted}${spaceBetween ? ' ' : ''}${code}`
	}

	return formatted
}

/**
 * Format plain number but with locale separators (no currency)
 */
export function formatNumber(
	value: number | string | null | undefined,
	opts: Omit<TFormatMoneyOptions, 'currency' | 'useSymbol' | 'showCode'> = {}
) {
	return formatMoney(value, {
		...opts,
		currency: undefined,
		useSymbol: false,
		showCode: false,
	})
}

/**
 * Format number as percentage with optional plus sign
 */
export function formatPercent(
	value: number | string | null | undefined,
	opts: Omit<TFormatMoneyOptions, 'currency' | 'useSymbol' | 'showCode'> & {
		showPlus?: boolean
	} = {}
) {
	const { showPlus = false, ...formatOpts } = opts
	const num = typeof value === 'string' ? Number(value) : value
	const formatted = formatNumber(num, formatOpts)

	if (value === null || value === undefined || value === '') return formatted

	const isPositive = typeof num === 'number' && Number.isFinite(num) && num > 0
	const prefix = showPlus && isPositive ? '+' : ''
	return `${prefix}${formatted}%`
}

/**
formatMoney(3035841.2)
// "3,035,841.20" (default locale en, digits 2)

formatNumber(3035841.2, { locale: 'vi' })
// "3.035.841,2" hoặc "3.035.841,20" set (numeral locale vi)

formatMoney(3035841.2, { currency: 'USD', showCode: true })
// "3,035,841.20 USD"

formatMoney(3035841.2, { currency: 'VND', showCode: true, locale: 'vi' })
// "3.035.841 VND" (default VND digits=2)

formatMoney(3035841.2, { currency: 'USD', useSymbol: true })
// "$ 3,035,841.20"

formatMoney(3035841.2, { currency: 'VND', useSymbol: true, locale: 'vi' })
// "₫ 3.035.841"

formatMoney(3035841.2, { currency: 'USD', digits: 0, showCode: true })
// "3,035,841 USD"

formatMoney(3035841.2, { currency: 'USD', digits: 4, useSymbol: true })
// "$ 3,035,841.2000"

formatMoney(10, { currency: 'VND', digits: 2, useSymbol: true, locale: 'vi' })
// "₫ 10,00" (can be overrided to VND default 0)

formatMoney(1234, { currency: 'USD', digits: 2, trimZeros: true, showCode: true })
// "1,234 USD" (because .00  trimed)

formatMoney(1234.5, { currency: 'USD', digits: 2, trimZeros: true, showCode: true })
// "1,234.5 USD"

formatMoney(1234.56, { currency: 'USD', digits: 2, trimZeros: true, showCode: true })
// "1,234.56 USD"

formatMoney(1523400, { currency: 'USD', compact: true, useSymbol: true })
// "$ 1.5m" (if digits default is 2 and trimZeros is false this can be "$ 1.52m" depend on numeral)

formatMoney(1500000, { currency: 'USD', compact: true, digits: 2, trimZeros: true, useSymbol: true })
// "$ 1.5m"

formatMoney(3035841.2, { currency: 'USD', showCode: true, spaceBetween: false })
// "3,035,841.20USD"

formatMoney(3035841.2, { currency: 'USD', useSymbol: true, spaceBetween: false })
// "$3,035,841.20"

formatMoney(null, { fallback: '-' })
// "-"

formatMoney('abc' as any, { fallback: 'N/A' })
// "N/A"

*/
