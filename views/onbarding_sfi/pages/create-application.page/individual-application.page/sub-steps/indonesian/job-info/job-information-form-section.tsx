import RfhSfiNumberInput from '@/components/rhf-inputs/rfh-sfi-number-input'
import RfhSfiSingleAutocomplete from '@/components/rhf-inputs/rfh-sfi-single-autocomplete'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { CITY_OPTIONS } from '@/constants/sfi/indo-city.const'
import { Divider, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import {
	ANNUAL_INCOME_OPTIONS,
	COMPANY_LINE_OF_BUSINESS_OPTIONS,
	JobInformationFormData,
	SOURCE_OF_FUNDS_OPTIONS,
	TYPE_OF_JOB_OPTIONS,
} from './form-validate/schema'

function JobInformationFormSection() {
	const { control } = useFormContext<JobInformationFormData>()

	return (
		<div className="flex flex-col gap-6">
			<Typography variant="h6" className="text-primary font-bold">
				Occupation
			</Typography>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<RfhSfiSingleSelect
					name="type_job"
					control={control}
					label="Type of Job"
					options={TYPE_OF_JOB_OPTIONS}
				/>
				<RfhSfiSingleSelect
					name="company_line_of_business"
					control={control}
					label="Company Line of Business"
					options={COMPANY_LINE_OF_BUSINESS_OPTIONS}
				/>

				<RfhSfiTextField name="company_job_title" control={control} label="Job Title" />
				<RfhSfiTextField name="company_name" control={control} label="Company Name" />

				<div className="lg:col-span-2">
					<RfhSfiTextField name="company_address" control={control} label="Company Address" />
				</div>

				<RfhSfiTextField name="company_village" control={control} label="Suburb/Village (Optional)" />
				<RfhSfiTextField name="company_sub_district" control={control} label="Sub-District (Optional)" />

				<RfhSfiSingleAutocomplete
					name="company_city"
					control={control}
					label="City/Regency"
					options={CITY_OPTIONS}
					disableClearable
				/>
				<RfhSfiTextField name="company_province" control={control} label="Province (Optional)" />

				<RfhSfiTextField name="company_postal_code" control={control} label="Postal Code" />
				<RfhSfiTextField name="company_country" control={control} label="Country (Optional)" />

				<RfhSfiNumberInput
					name="length_of_work"
					control={control}
					label="Length of Work"
					decimalScale={0}
					allowNegative={false}
					suffix=" Year(s)"
				/>
			</div>

			<Divider />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<RfhSfiSingleSelect
					name="annual_income"
					control={control}
					label="Annual Income"
					options={ANNUAL_INCOME_OPTIONS}
				/>
				<RfhSfiSingleSelect
					name="source_of_fund"
					control={control}
					label="Source of Funds"
					options={SOURCE_OF_FUNDS_OPTIONS}
				/>
			</div>
		</div>
	)
}

export default JobInformationFormSection
