import { OcrStructuredResult } from '@/services/common/ocr'
import { PrivyKtpData } from '@/services/customer/ekyc'

export interface PersonalInformationOcrPatch {
	ktp_or_passport?: string
	npwp_number?: string
	full_name?: string
	place_birth?: string
	gender?: 'male' | 'female'
	birthday?: string
	home_address?: string
	home_address_village?: string
	home_address_sub_district?: string
	home_address_postal_code?: string
	home_address_regency_code?: string
	home_address_province?: string
	home_address_country?: string
	marriage_status?: 'single' | 'married' | 'widower'
}

const toTitleCase = (value: string) =>
	value
		.toLowerCase()
		.replace(/(^|[\s./,-])\p{L}/gu, (character) => character.toUpperCase())
		.replace(/\bRt\b/g, 'RT')
		.replace(/\bRw\b/g, 'RW')

const isKnownValue = (value?: string): value is string => Boolean(value && value.toUpperCase() !== 'UNKNOWN')

const mapGender = (value?: string): 'male' | 'female' | undefined => {
	const gender = value?.toUpperCase()

	if (gender?.includes('LAKI') || gender === 'M') return 'male'
	if (gender?.includes('PEREMPUAN') || gender === 'F') return 'female'
}

const mapMarriageStatus = (value?: string): 'single' | 'married' | 'widower' | undefined => {
	const status = value?.toUpperCase()

	if (status?.includes('BELUM KAWIN')) return 'single'
	if (status?.includes('KAWIN')) return 'married'
	if (status?.includes('CERAI')) return 'widower'
}

const mapBirthday = (value?: string) => {
	if (!value) return undefined

	const parts = value.split('-')
	return parts.length === 3 && parts[0].length === 2 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value
}

const mapCountry = (value?: string) => {
	if (!value || value.toUpperCase().includes('WNI')) return 'Indonesia'
	return toTitleCase(value)
}

export function findKtpData(value: unknown): PrivyKtpData | undefined {
	if (!value || typeof value !== 'object') return undefined

	const record = value as Record<string, unknown>
	if (typeof record.nik === 'string') return record as unknown as PrivyKtpData

	for (const nestedValue of Object.values(record)) {
		const result = findKtpData(nestedValue)
		if (result) return result
	}
}

export function mapKtpData(data: PrivyKtpData): PersonalInformationOcrPatch {
	const province = data.provinsi?.replace(/^PROVINSI\s+/i, '').trim()
	const city = data.kota?.replace(/^(KABUPATEN|KOTA)\s+/i, '').trim()
	const birthday = mapBirthday(data.tanggal_lahir || data.tgl_lahir)
	const marriageStatus = mapMarriageStatus(data.status_perkawinan)
	const gender = mapGender(data.jenis_kelamin)
	const addressParts = [
		data.alamat,
		data.rt_rw && `RT/RW ${data.rt_rw}`,
		data.kelurahan && `Kelurahan ${data.kelurahan}`,
		data.kecamatan && `Kecamatan ${data.kecamatan}`,
		province && `Provinsi ${province}`,
	].filter(Boolean)

	return {
		ktp_or_passport: data.nik,
		...(data.nama && { full_name: toTitleCase(data.nama) }),
		...(birthday && { birthday }),
		place_birth: mapCountry(data.kewarganegaraan),
		home_address_country: mapCountry(data.kewarganegaraan),
		...(addressParts.length && { home_address: toTitleCase(addressParts.join(' ')) }),
		...(data.kelurahan && {
			home_address_village: toTitleCase(data.kelurahan.replace(/^(KELURAHAN|DESA)\s+/i, '').trim()),
		}),
		...(data.kecamatan && { home_address_sub_district: toTitleCase(data.kecamatan) }),
		...(province && { home_address_province: toTitleCase(province) }),
		...(city && {
			home_address_regency_code: province ? `${toTitleCase(province)} - ${toTitleCase(city)}` : toTitleCase(city),
		}),
		...(marriageStatus && { marriage_status: marriageStatus }),
		...(gender && { gender }),
	}
}

export function mapPassportData(data: OcrStructuredResult): PersonalInformationOcrPatch {
	const documentNumber = isKnownValue(data.idNumber) ? data.idNumber : data.passportNumber
	const streetAddress = data.address?.streetAddress
	const district = data.address?.district
	const postalCode = data.address?.postalCode
	const province = data.address?.province
	const gender = mapGender(data.gender)

	return {
		...(isKnownValue(documentNumber) && { ktp_or_passport: documentNumber }),
		...(isKnownValue(data.dateOfBirth) && { birthday: data.dateOfBirth }),
		...(isKnownValue(data.name) && { full_name: toTitleCase(data.name) }),
		...(isKnownValue(streetAddress) && { home_address: toTitleCase(streetAddress) }),
		...(isKnownValue(district) && { home_address_sub_district: toTitleCase(district) }),
		...(isKnownValue(postalCode) && { home_address_postal_code: postalCode }),
		...(isKnownValue(province) && { home_address_province: toTitleCase(province) }),
		...(isKnownValue(data.country) && { home_address_country: mapCountry(data.country) }),
		...(gender && { gender }),
	}
}

export function mapNpwpData(data: OcrStructuredResult): PersonalInformationOcrPatch {
	return isKnownValue(data.taxNumber) ? { npwp_number: data.taxNumber } : {}
}
