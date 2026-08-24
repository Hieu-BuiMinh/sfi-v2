'use client'

import { customerDepositService } from '@/services/customer/finance/deposit'
import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { DepositFormValues } from './deposit-form.schema'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiNumberInput from '@/components/rhf-inputs/rfh-sfi-number-input'

interface DepositFormStep1Props {
	onSuccess: (data: DepositFormValues) => void
	onCancel?: () => void
}

function DepositFormStep1({ onSuccess, onCancel }: DepositFormStep1Props) {
	const { control, handleSubmit, setValue } = useFormContext<DepositFormValues>()

	const { data: beneficiaryBanksResponse, isLoading: isLoadingBanks } = useQuery({
		queryKey: customerDepositService.getBeneficiaryBanks.key(),
		queryFn: customerDepositService.getBeneficiaryBanks.get,
	})

	const selectedBankId = useWatch({
		control,
		name: 'beneficiaryInformation.beneficiaryBankId',
	})

	const bankOptions = useMemo(() => {
		return (
			beneficiaryBanksResponse?.data
				?.filter((bank) => bank.status === 1)
				.map((bank) => ({
					label: `${bank.bank.short_name} - ${bank.bank.name} (${bank.currency})`,
					value: bank.id,
					data: bank,
				})) || []
		)
	}, [beneficiaryBanksResponse])

	useEffect(() => {
		if (selectedBankId) {
			const selected = bankOptions.find((b) => b.value === selectedBankId)
			if (selected) {
				setValue('beneficiaryInformation.beneficiaryBankLabel', selected.label, { shouldValidate: true })
				setValue('beneficiaryInformation.beneficiaryName', selected.data.beneficiary_account_name, {
					shouldValidate: true,
				})
				setValue('beneficiaryInformation.beneficiaryAccountNumber', selected.data.beneficiary_account_number, {
					shouldValidate: true,
				})
				setValue('beneficiaryInformation.bankCode', selected.data.bank_code || '', {
					shouldValidate: true,
				})
				setValue('beneficiaryInformation.swiftCode', selected.data.beneficiary_swift_code || '', {
					shouldValidate: true,
				})
			}
		}
	}, [selectedBankId, bankOptions, setValue])

	const onSubmit = (data: DepositFormValues) => {
		onSuccess(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{/* 1. Customer Information */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<span className="bg-mui-info/30 flex size-10 shrink-0 items-center justify-center rounded-lg font-bold">
						1
					</span>
					<h3 className="text-xl font-semibold">Customer information</h3>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<RfhSfiTextField
						name="customerInformation.customerName"
						control={control}
						label="Customer name"
						disabled
					/>
					<RfhSfiTextField
						name="customerInformation.tradingAccountNumber"
						control={control}
						label="Trading account number"
						disabled
					/>
				</div>
			</section>

			{/* 2. Beneficiary Information */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<span className="bg-mui-info/30 flex size-10 shrink-0 items-center justify-center rounded-lg font-bold">
						2
					</span>
					<h3 className="text-xl font-semibold">Beneficiary information</h3>
				</div>

				<div className="space-y-4">
					<RfhSfiSingleSelect
						name="beneficiaryInformation.beneficiaryBankId"
						control={control}
						label="Beneficiary Bank"
						options={bankOptions}
						disabled={isLoadingBanks}
						containerClassName="w-full"
					/>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<RfhSfiTextField
							name="beneficiaryInformation.beneficiaryName"
							control={control}
							label="Beneficiary Name"
							disabled
						/>
						<RfhSfiTextField
							name="beneficiaryInformation.beneficiaryAccountNumber"
							control={control}
							label="Beneficiary Account Number"
							disabled
						/>
						<RfhSfiTextField
							name="beneficiaryInformation.bankCode"
							control={control}
							label="Bank Code"
							disabled
						/>
						<RfhSfiTextField
							name="beneficiaryInformation.swiftCode"
							control={control}
							label="Swift Code"
							disabled
						/>
					</div>
				</div>
			</section>

			{/* 3. Transfer Instructions */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<span className="bg-mui-info/30 flex size-10 shrink-0 items-center justify-center rounded-lg font-bold">
						3
					</span>
					<h3 className="text-xl font-semibold">Transfer instructions</h3>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<RfhSfiNumberInput name="transferInstructions.amount" control={control} label="Amount" />
					<RfhSfiTextField
						name="transferInstructions.paymentDetails"
						control={control}
						label="Payment details"
						multiline
						rows={2}
						containerClassName="md:col-span-2"
					/>
				</div>
			</section>

			{/* Form Actions */}
			<div className="flex justify-end gap-4 pt-4">
				<Button variant="outlined" onClick={onCancel} color="secondary">
					Cancel
				</Button>
				<Button variant="contained" type="submit" color="primary">
					Continue
				</Button>
			</div>
		</form>
	)
}

export default DepositFormStep1
