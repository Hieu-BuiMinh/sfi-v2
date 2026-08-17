import RfhSfiSingleAutocomplete from '@/components/rhf-inputs/rfh-sfi-single-autocomplete'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { INDO_BANK_BRANCH_OPTIONS } from '@/constants/sfi/indo-bank.const'
import { Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { BankAccountFormData } from './form-validate/schema'

const bankOptions = INDO_BANK_BRANCH_OPTIONS.map((bank) => ({
	value: bank,
	label: bank,
}))

function BankAccountFormSection() {
	const { control } = useFormContext<BankAccountFormData>()

	return (
		<div className="flex flex-col gap-6">
			<Typography variant="h6" className="text-primary font-bold">
				Main bank account information
			</Typography>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div className="lg:col-span-2">
					<RfhSfiSingleAutocomplete
						name="bank_branch_name"
						control={control}
						label="Bank Name"
						options={bankOptions}
						disableClearable
					/>
				</div>

				<RfhSfiTextField name="full_name" control={control} label="Full Name" />
				<RfhSfiTextField
					name="account_number"
					control={control}
					label="Account Number"
					slotProps={{ htmlInput: { inputMode: 'numeric' } }}
				/>
			</div>
		</div>
	)
}

export default BankAccountFormSection
