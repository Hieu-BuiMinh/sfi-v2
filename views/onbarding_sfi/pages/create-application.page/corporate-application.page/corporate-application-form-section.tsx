import RfhSfiCountrySelect from '@/components/rhf-inputs/rfh-sfi-country-select'
import RhfPhoneInput from '@/components/rhf-inputs/rhf-phone-input'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { Divider, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import {
	ANNUAL_REVENUE_OPTIONS,
	CorporateApplicationFormData,
	NATURE_OF_BUSINESS_OPTIONS,
	PREFERRED_CONTACT_METHOD_OPTIONS,
} from './form-validate/schema'

function CorporateApplicationFormSection() {
	const { control } = useFormContext<CorporateApplicationFormData>()

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4">
				<Typography variant="subtitle1" className="text-primary font-bold uppercase">
					Corporate Identity Information
				</Typography>

				<RfhSfiTextField name="company_name" control={control} label="Company Name (as per registration)" />
				<RfhSfiCountrySelect
					name="country_of_incorporation"
					control={control}
					label="Country of Incorporation"
					containerClassName="w-full"
				/>
				<RfhSfiTextField
					name="business_registration_number"
					control={control}
					label="Business Registration Number/Business License No. (Optional)"
				/>
				<RfhSfiSingleSelect
					name="nature_of_business"
					control={control}
					label="Nature Of Business"
					options={NATURE_OF_BUSINESS_OPTIONS}
				/>
				<RfhSfiTextField
					name="business_address"
					control={control}
					label="Business Address (Optional)"
					placeholder="Number/Block/Street Name"
				/>
				<RfhSfiSingleSelect
					name="estimated_annual_revenue_range"
					control={control}
					label="Estimated Annual Revenue Range (Optional)"
					options={ANNUAL_REVENUE_OPTIONS}
				/>
			</div>

			<Divider />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Typography variant="subtitle1" className="text-primary font-bold uppercase lg:col-span-2">
					Primary Contact Person Details
				</Typography>

				<RfhSfiTextField name="full_name" control={control} label="Full Name" />
				<RfhSfiTextField name="position_title" control={control} label="Position / Title" />
				<RfhSfiTextField name="email_address" control={control} label="Email Address" type="email" />
				<RhfPhoneInput name="mobile_number" control={control} label="Phone Number" />

				<div className="lg:col-span-2">
					<RfhSfiSingleSelect
						name="preferred_contact_method"
						control={control}
						label="Preferred Contact Method"
						options={PREFERRED_CONTACT_METHOD_OPTIONS}
						containerClassName="w-full"
					/>
				</div>
			</div>
		</div>
	)
}

export default CorporateApplicationFormSection
