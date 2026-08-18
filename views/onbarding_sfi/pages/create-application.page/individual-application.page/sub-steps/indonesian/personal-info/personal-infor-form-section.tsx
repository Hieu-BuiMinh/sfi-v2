'use client'

import React, { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import {
	PersonalInformationFormData,
	MARRIAGE_STATUS_OPTIONS,
	HOME_OWNERSHIP_OPTIONS,
	RELATIONSHIP_OPTIONS,
} from './form-validate/schema'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiDatePicker from '@/components/rhf-inputs/rfh-sfi-date-picker'
import RhfPhoneInput from '@/components/rhf-inputs/rhf-phone-input'
import RfhSfiCountrySelect from '@/components/rhf-inputs/rfh-sfi-country-select'
import RfhSfiSingleAutocomplete from '@/components/rhf-inputs/rfh-sfi-single-autocomplete'
import { Typography, Divider } from '@mui/material'
import { CITY_OPTIONS } from '@/constants/sfi/indo-city.const'
import RfhSfiCheckbox from '@/components/rhf-inputs/rfh-sfi-checkbox'

function PersonalInforFormSection() {
	const { control, setValue } = useFormContext<PersonalInformationFormData>()

	const relationshipValue = useWatch({
		control,
		name: 'relationship_with_customer',
	})
	const isRegisteredAddressSame = useWatch({
		control,
		name: 'is_address_same',
	})
	const [
		registeredAddress,
		registeredVillage,
		registeredSubDistrict,
		registeredCity,
		registeredProvince,
		registeredPostalCode,
		registeredCountry,
	] = useWatch({
		control,
		name: [
			'home_address',
			'home_address_village',
			'home_address_sub_district',
			'home_address_regency_code',
			'home_address_province',
			'home_address_postal_code',
			'home_address_country',
		],
	})

	useEffect(() => {
		if (relationshipValue !== 'other') {
			setValue('relationship_with_customer_other', '')
		}
	}, [relationshipValue, setValue])

	useEffect(() => {
		if (!isRegisteredAddressSame) return

		setValue('current_address', registeredAddress)
		setValue('current_address_village', registeredVillage)
		setValue('current_address_sub_district', registeredSubDistrict)
		setValue('current_address_regency_code', registeredCity)
		setValue('current_address_province', registeredProvince)
		setValue('current_address_postal_code', registeredPostalCode)
		setValue('current_address_country', registeredCountry)
	}, [
		isRegisteredAddressSame,
		registeredAddress,
		registeredCity,
		registeredCountry,
		registeredPostalCode,
		registeredProvince,
		registeredSubDistrict,
		registeredVillage,
		setValue,
	])

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Typography variant="subtitle1" className="text-primary col-span-1 font-bold lg:col-span-2">
					Personal Information
				</Typography>

				<div className="col-span-1 lg:col-span-2">
					<RfhSfiTextField name="ktp_or_passport" control={control} label="KTP or Passport Number" />
				</div>

				<div className="col-span-1 lg:col-span-2">
					<RfhSfiTextField
						name="npwp_number"
						control={control}
						label="Tax Identification Number (NPWP) (Optional)"
					/>
				</div>

				{/* Full Name */}
				<div className="col-span-1">
					<RfhSfiTextField name="full_name" control={control} label="Full name (KTP/Passport)" />
				</div>

				{/* Place of Birth */}
				<div className="col-span-1">
					<RfhSfiCountrySelect
						name="place_birth"
						control={control}
						label="Place of Birth (POB)"
						containerClassName="w-full"
					/>
				</div>

				{/* Gender */}
				<div className="col-span-1">
					<RfhSfiSingleSelect
						name="gender"
						control={control}
						label="Gender"
						options={[
							{ value: 'male', label: 'Male' },
							{ value: 'female', label: 'Female' },
						]}
						containerClassName="w-full"
					/>
				</div>

				{/* Date of Birth */}
				<div className="col-span-1">
					<RfhSfiDatePicker name="birthday" control={control} label="Date of Birth (DOB)" />
				</div>

				{/* Email */}
				<div className="col-span-1">
					<RfhSfiTextField name="email" control={control} label="Email" type="email" />
				</div>

				{/* Phone Number */}
				<div className="col-span-1">
					<RhfPhoneInput name="phone" control={control} label="Phone Number" placeholder="12 345 678 901" />
				</div>
			</div>

			<Divider />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Typography variant="subtitle1" className="text-primary col-span-1 font-bold lg:col-span-2">
					Registered Address (KTP/Passport)
				</Typography>

				{/* Registered Address */}
				<div className="col-span-1 lg:col-span-2 lg:grid-cols-2">
					<RfhSfiTextField
						name="home_address"
						control={control}
						label="Registered Address (KTP/Passport)"
						multiline
						rows={2}
					/>
				</div>

				<RfhSfiTextField name="home_address_village" control={control} label="Suburb/Village (Optional)" />
				<RfhSfiTextField name="home_address_sub_district" control={control} label="Sub-District (Optional)" />

				<RfhSfiSingleAutocomplete
					name="home_address_regency_code"
					control={control}
					label="City/Regency"
					options={CITY_OPTIONS}
					disableClearable
				/>
				<RfhSfiTextField name="home_address_province" control={control} label="Province (Optional)" />

				{/* Registered Postal Code */}
				<div className="col-span-1">
					<RfhSfiTextField name="home_address_postal_code" control={control} label="Postal Code" />
				</div>

				<RfhSfiCountrySelect
					name="home_address_country"
					control={control}
					label="Country (Optional)"
					containerClassName="w-full"
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{/* Marriage Status */}
				<div className="col-span-1">
					<RfhSfiSingleSelect
						name="marriage_status"
						control={control}
						label="Marriage Status"
						options={MARRIAGE_STATUS_OPTIONS}
						containerClassName="w-full"
					/>
				</div>

				{/* Home Ownership Status */}
				<div className="col-span-1">
					<RfhSfiSingleSelect
						name="home_ownership_status"
						control={control}
						label="Home Ownership Status"
						options={HOME_OWNERSHIP_OPTIONS}
						containerClassName="w-full"
					/>
				</div>
			</div>

			<Divider />

			<RfhSfiCheckbox
				name="is_address_same"
				control={control}
				label="Check this box if your ID registered address is the same as your residential address"
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Typography variant="subtitle1" className="text-primary col-span-1 font-bold lg:col-span-2">
					Current Address
				</Typography>

				{/* Current Address */}
				<div className="col-span-1 lg:col-span-2">
					<RfhSfiTextField
						name="current_address"
						control={control}
						label="Current Address"
						multiline
						rows={2}
						disabled={isRegisteredAddressSame}
					/>
				</div>

				<RfhSfiTextField
					name="current_address_village"
					control={control}
					label="Suburb/Village (Optional)"
					disabled={isRegisteredAddressSame}
				/>
				<RfhSfiTextField
					name="current_address_sub_district"
					control={control}
					label="Sub-District (Optional)"
					disabled={isRegisteredAddressSame}
				/>

				<RfhSfiSingleAutocomplete
					name="current_address_regency_code"
					control={control}
					label="City/Regency"
					options={CITY_OPTIONS}
					disableClearable
					disabled={isRegisteredAddressSame}
				/>
				<RfhSfiTextField
					name="current_address_province"
					control={control}
					label="Province (Optional)"
					disabled={isRegisteredAddressSame}
				/>

				{/* Current Postal Code */}
				<div className="col-span-1">
					<RfhSfiTextField
						name="current_address_postal_code"
						control={control}
						label="Postal Code"
						disabled={isRegisteredAddressSame}
					/>
				</div>

				<RfhSfiCountrySelect
					name="current_address_country"
					control={control}
					label="Country (Optional)"
					containerClassName="w-full"
					disabled={isRegisteredAddressSame}
				/>
			</div>

			<Divider />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Typography variant="subtitle1" className="text-primary col-span-1 font-bold lg:col-span-2">
					Emergency Contact Info
				</Typography>

				{/* Emergency Contact Name */}
				<div className="col-span-1">
					<RfhSfiTextField name="emergency_contact_name" control={control} label="Emergency Contact Name" />
				</div>

				{/* Emergency Contact Phone Number */}
				<div className="col-span-1">
					<RhfPhoneInput name="emergency_phone" control={control} label="Emergency Contact Phone Number" />
				</div>

				{/* Relationship with Customer */}
				<div className="col-span-1">
					<RfhSfiSingleSelect
						name="relationship_with_customer"
						control={control}
						label="Relationship with Customer"
						options={RELATIONSHIP_OPTIONS}
						containerClassName="w-full"
					/>
				</div>

				{/* Relationship Other */}
				{relationshipValue === 'other' && (
					<div className="col-span-1">
						<RfhSfiTextField
							name="relationship_with_customer_other"
							control={control}
							label="Please specify relationship"
						/>
					</div>
				)}

				{/* Mother's Maiden Name */}
				<div className="col-span-1">
					<RfhSfiTextField name="mother_maiden_name" control={control} label="Mother's Maiden Name" />
				</div>
			</div>

			<Divider />

			<div className="flex flex-col gap-4">
				<Typography variant="subtitle1" className="text-primary font-bold">
					Referral Code
				</Typography>
				<RfhSfiTextField name="referral_code" control={control} label="Referral Code" />
			</div>
		</div>
	)
}

export default PersonalInforFormSection
