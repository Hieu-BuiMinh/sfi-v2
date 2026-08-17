'use client'

import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress } from '@mui/material'
import { parseAsInteger, useQueryState } from 'nuqs'
import { FormProvider, useForm } from 'react-hook-form'
import BankAccountFormSection from './bank-account-form-section'
import { BankAccountFormData, bankAccountSchema } from './form-validate/schema'

function NonIndoBankAccountFormStep() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const isReadOnly = false
	const [, setStep] = useQueryState('step', parseAsInteger)
	const bankAccount = currentIndiApp?.content?.customer_particular?.bank_account

	const methods = useForm<BankAccountFormData>({
		resolver: zodResolver(bankAccountSchema),
		defaultValues: {
			bank_branch_name: bankAccount?.bank_branch_name || '',
			full_name: bankAccount?.full_name || '',
			account_number: bankAccount?.account_number || '',
			swift_bic_code: bankAccount?.swift_bic_code || '',
			bank_branch_address: bankAccount?.bank_branch_address || '',
		},
	})

	const onSubmit = (data: BankAccountFormData) => {
		if (!currentIndiApp) return

		updateApplicationMutation.mutate(
			{
				data: {
					...currentIndiApp,
					content: {
						...currentIndiApp.content,
						customer_particular: {
							...currentIndiApp.content?.customer_particular,
							bank_account: data,
						},
					},
				},
			},
			{
				onSuccess: () => {
					setStep(1)
				},
			}
		)
	}

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
				<fieldset disabled={isReadOnly} className="flex flex-col gap-6">
					<BankAccountFormSection />

					<div className="mt-4 flex justify-end">
						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={updateApplicationMutation.isPending || isReadOnly}
						>
							{updateApplicationMutation.isPending ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								'Complete Step 1'
							)}
						</Button>
					</div>
				</fieldset>
			</form>
		</FormProvider>
	)
}

export default NonIndoBankAccountFormStep
