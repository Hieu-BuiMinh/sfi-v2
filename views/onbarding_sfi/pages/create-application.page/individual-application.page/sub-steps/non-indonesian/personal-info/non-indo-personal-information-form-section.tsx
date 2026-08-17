'use client'

import RfhSfiCountrySelect from '@/components/rhf-inputs/rfh-sfi-country-select'
import RfhSfiDatePicker from '@/components/rhf-inputs/rfh-sfi-date-picker'
import RhfPhoneInput from '@/components/rhf-inputs/rhf-phone-input'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { Divider, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { PersonalInformationFormData, RELATIONSHIP_OPTIONS } from './form-validate/schema'

function NonIndoPersonalInformationFormSection() {
	const { control, setValue } = useFormContext<PersonalInformationFormData>()
	const relationship = useWatch({ control, name: 'relationship_with_customer' })

	useEffect(() => {
		if (relationship !== 'Other') setValue('relationship_with_customer_other', '')
	}, [relationship, setValue])

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Typography variant="subtitle1" className="text-primary font-bold lg:col-span-2">
					Personal Information
				</Typography>

				<div className="lg:col-span-2">
					<RfhSfiTextField name="ktp_or_passport" control={control} label="Passport Number" />
				</div>

				<RfhSfiCountrySelect
					name="selectedCountry"
					control={control}
					label="Select your Nationality"
					containerClassName="w-full"
				/>
				<div />

				<RfhSfiTextField name="full_name" control={control} label="Full name (Passport)" />
				<RfhSfiCountrySelect
					name="place_birth"
					control={control}
					label="Place of Birth (POB)"
					containerClassName="w-full"
				/>

				<RfhSfiSingleSelect
					name="gender"
					control={control}
					label="Gender"
					options={[
						{ value: 'male', label: 'Male' },
						{ value: 'female', label: 'Female' },
					]}
				/>
				<RfhSfiDatePicker name="birthday" control={control} label="Date of Birth (DOB)" />

				<RfhSfiTextField name="email" control={control} label="Email" type="email" />
				<RhfPhoneInput name="phone" control={control} label="Phone Number" />
			</div>

			<Divider />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-3">
					<RfhSfiTextField name="id_address" control={control} label="Current Address" />
				</div>

				<RfhSfiTextField name="village" control={control} label="Suburb/Village (Optional)" />
				<RfhSfiTextField name="sub_district" control={control} label="Sub-District (Optional)" />
				<RfhSfiTextField name="city" control={control} label="City" />

				<RfhSfiTextField name="province" control={control} label="Province (Optional)" />
				<RfhSfiTextField name="postal_code" control={control} label="Postal Code" />
				<RfhSfiCountrySelect name="country" control={control} label="Country" containerClassName="w-full" />
			</div>

			<Divider />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Typography variant="subtitle1" className="text-primary font-bold lg:col-span-2">
					Emergency Contact Info
				</Typography>

				<RfhSfiTextField name="emergency_contact_name" control={control} label="Emergency Contact Name" />
				<RhfPhoneInput name="emergency_phone" control={control} label="Emergency Contact Phone Number" />

				<RfhSfiSingleSelect
					name="relationship_with_customer"
					control={control}
					label="Relationship with Customer"
					options={RELATIONSHIP_OPTIONS}
				/>
				<RfhSfiTextField name="mother_maiden_name" control={control} label="Customer's Mother's Maiden Name" />

				{relationship === 'Other' && (
					<RfhSfiTextField
						name="relationship_with_customer_other"
						control={control}
						label="Please specify relationship"
					/>
				)}
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

export default NonIndoPersonalInformationFormSection
