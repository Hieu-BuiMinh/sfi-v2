import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { BankAccountFormData } from './form-validate/schema'

function BankAccountFormSection() {
	const { control } = useFormContext<BankAccountFormData>()

	return (
		<div className="flex flex-col gap-6">
			<Typography variant="h6" className="text-primary font-bold">
				Main bank account information
			</Typography>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-3">
					<RfhSfiTextField name="bank_branch_name" control={control} label="Bank Name" />
				</div>

				<RfhSfiTextField name="full_name" control={control} label="Full Name" />
				<RfhSfiTextField
					name="account_number"
					control={control}
					label="Account Number"
					slotProps={{ htmlInput: { inputMode: 'numeric' } }}
				/>
				<RfhSfiTextField name="swift_bic_code" control={control} label="SWIFT/BIC Code" />

				<div className="lg:col-span-3">
					<RfhSfiTextField
						name="bank_branch_address"
						control={control}
						label="Bank Branch Address"
					/>
				</div>
			</div>
		</div>
	)
}

export default BankAccountFormSection
