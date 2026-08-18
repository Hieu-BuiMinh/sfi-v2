import { OcrStructuredResult } from '@/services/common/ocr'

export interface ForeignPassportOcrPatch {
	ktp_or_passport?: string
	full_name?: string
	place_birth?: string
	gender?: 'male' | 'female'
	birthday?: string
	selectedCountry?: string
	country?: string
}

const isKnownValue = (value?: string): value is string => Boolean(value && value.toUpperCase() !== 'UNKNOWN')

export function mapForeignPassportData(data: OcrStructuredResult): ForeignPassportOcrPatch {
	const nationality = isKnownValue(data.nationality) ? data.nationality : data.country
	const gender = data.gender?.toUpperCase()

	return {
		...(isKnownValue(data.passportNumber) && { ktp_or_passport: data.passportNumber }),
		...(isKnownValue(data.name) && { full_name: data.name }),
		...(isKnownValue(data.placeOfBirth) && { place_birth: data.placeOfBirth }),
		...(isKnownValue(data.dateOfBirth) && { birthday: data.dateOfBirth }),
		...(gender === 'M' && { gender: 'male' as const }),
		...(gender === 'F' && { gender: 'female' as const }),
		...(isKnownValue(nationality) && { selectedCountry: nationality, country: nationality }),
	}
}
