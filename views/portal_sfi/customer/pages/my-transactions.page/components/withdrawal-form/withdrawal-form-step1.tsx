'use client'

import { customerFinanceTransactionsService } from '@/services/customer/finance/transactions'
import { customerUserPaymentMethodsService } from '@/services/customer/finance/user-payment-methods'
import { Button, InputAdornment } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { WithdrawalFormValues } from './withdrawal-form.schema'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiNumberInput from '@/components/rhf-inputs/rfh-sfi-number-input'

interface WithdrawalFormStep1Props {
	onSuccess: (data: WithdrawalFormValues) => void
	onCancel?: () => void
}

const CURRENCIES = [
	{ label: 'IDR', value: 'IDR' },
	{ label: 'USD', value: 'USD' },
]

function WithdrawalFormStep1({ onSuccess, onCancel }: WithdrawalFormStep1Props) {
	const { control, handleSubmit, setValue } = useFormContext<WithdrawalFormValues>()

	const { data: paymentMethodsResponse, isLoading: isLoadingBanks } = useQuery({
		queryKey: customerUserPaymentMethodsService.getUserPaymentMethods.key(),
		queryFn: customerUserPaymentMethodsService.getUserPaymentMethods.get,
	})

	const selectedBankId = useWatch({
		control,
		name: 'beneficiaryInformation.bankId',
	})
	const amount = useWatch({ control, name: 'transferInformation.amount' })
	const currency = useWatch({ control, name: 'transferInformation.currency' })

	const debouncedAmount = useDebounce(amount, 500)

	const bankOptions = useMemo(() => {
		return (
			paymentMethodsResponse?.data?.map((item) => ({
				label: `${item.beneficiary_bank_name} - ${item.beneficiary_account_number}`,
				value: item.beneficiary_account_number,
				data: item,
			})) || []
		)
	}, [paymentMethodsResponse])

	const quoteCurrency = useMemo(() => {
		return currency === 'USD' ? 'IDR' : 'USD'
	}, [currency])

	const { data: verifiedAmountResponse, isFetching: isFetchingVerification } = useQuery({
		queryKey: customerFinanceTransactionsService.getVerifiedAmount.key({
			amount: debouncedAmount,
			base_currency: quoteCurrency, // Target currency
			quote_currency: currency, // Source currency
			rate_type: 2,
		}),
		queryFn: () =>
			customerFinanceTransactionsService.getVerifiedAmount.get({
				amount: debouncedAmount,
				base_currency: quoteCurrency,
				quote_currency: currency,
				rate_type: 2,
			}),
		enabled: !!debouncedAmount && !!currency && !!quoteCurrency,
	})

	useEffect(() => {
		if (verifiedAmountResponse?.data?.verified_amount) {
			setValue('transferInformation.equivalentAmount', Number(verifiedAmountResponse.data.verified_amount), {
				shouldValidate: true,
			})
		}
	}, [verifiedAmountResponse, setValue])

	useEffect(() => {
		if (selectedBankId) {
			const selectedBank = bankOptions.find((b) => b.value === selectedBankId)
			if (selectedBank) {
				setValue('beneficiaryInformation.bankName', selectedBank.data.beneficiary_bank_name, {
					shouldValidate: true,
				})
				setValue('beneficiaryInformation.beneficiaryName', selectedBank.data.beneficiary_particulars_name, {
					shouldValidate: true,
				})
				setValue(
					'beneficiaryInformation.beneficiaryAccountNumber',
					selectedBank.data.beneficiary_account_number,
					{ shouldValidate: true }
				)
			}
		}
	}, [selectedBankId, bankOptions, setValue])

	const onSubmit = (data: WithdrawalFormValues) => {
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
						name="beneficiaryInformation.bankId"
						control={control}
						label="Bank Name"
						options={bankOptions}
						disabled={isLoadingBanks}
						containerClassName="w-full"
					/>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<RfhSfiTextField
							name="beneficiaryInformation.beneficiaryName"
							control={control}
							label="Beneficiary name"
							disabled
						/>
						<RfhSfiTextField
							name="beneficiaryInformation.beneficiaryAccountNumber"
							control={control}
							label="Beneficiary account number"
							disabled
						/>
					</div>
				</div>
			</section>

			{/* 3. Transfer Information */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<span className="bg-mui-info/30 flex size-10 shrink-0 items-center justify-center rounded-lg font-bold">
						3
					</span>
					<h3 className="text-xl font-semibold">Transfer information</h3>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="flex gap-2">
						<RfhSfiNumberInput
							name="transferInformation.amount"
							control={control}
							label="Amount"
							containerClassName="flex-1"
							slotProps={{
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<RfhSfiSingleSelect
												name="transferInformation.currency"
												control={control}
												options={CURRENCIES}
												containerClassName="w-24"
												sx={{
													'& .MuiOutlinedInput-notchedOutline': {
														border: 'none',
													},
													'& .MuiSelect-select': {
														padding: '0 !important',
														paddingRight: '20px !important',
														backgroundColor: 'transparent',
													},
													backgroundColor: 'transparent',
												}}
											/>
										</InputAdornment>
									),
								},
							}}
						/>
					</div>
					<RfhSfiNumberInput
						name="transferInformation.equivalentAmount"
						control={control}
						label={
							isFetchingVerification
								? 'Converting Equivalent Amount...'
								: `Equivalent amount (${quoteCurrency})`
						}
						disabled
					/>
					<RfhSfiTextField
						name="transferInformation.paymentDetails"
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

export default WithdrawalFormStep1
