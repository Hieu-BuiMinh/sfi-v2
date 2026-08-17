export const SFI_CURRENCIES = [
  'SGD',
  'GBP',
  'USD',
  'JPY',
  'CNH',
  'EUR',
  'HKD',
  'AUD',
  'NZD',
  'CHF',
  'CAD',
  'VND',
  'IDR',
] as const

export const SFI_CURRENCY_OPTIONS = SFI_CURRENCIES.map((currency) => ({
  label: currency,
  value: currency,
}))
