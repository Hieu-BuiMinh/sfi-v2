/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { PaymentType } from '@/constants/sfi/transactions.const'
import useProfile from '@/hooks/use-profile'
import { customerAccountService } from '@/services/customer/account'
import { customerDepositService } from '@/services/customer/finance/deposit'
import toastUtil from '@/utils/toast'
import DepositFormStep1 from '@/views/portal_sfi/customer/pages/my-transactions.page/components/deposit-form/deposit-form-step1'
import DepositFormStep2 from '@/views/portal_sfi/customer/pages/my-transactions.page/components/deposit-form/deposit-form-step2'
import {
	depositFormSchema,
	DepositFormValues,
} from '@/views/portal_sfi/customer/pages/my-transactions.page/components/deposit-form/deposit-form.schema'
import TransactionStep, {
	ITransactionStep,
} from '@/views/portal_sfi/customer/pages/my-transactions.page/components/transaction-step'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

function DepositPageView() {
	const router = useRouter()
	const { user } = useProfile()
	const [selectedAccount, _] = useQueryState('account')
	const [activeStep, setActiveStep] = useState(0)

	const methods = useForm<DepositFormValues>({
		resolver: zodResolver(depositFormSchema),
		mode: 'onChange',
		defaultValues: {
			customerInformation: {
				customerName: user?.name || '',
				tradingAccountNumber: selectedAccount || '',
			},
			beneficiaryInformation: {
				beneficiaryBankId: '',
				beneficiaryBankLabel: '',
				beneficiaryName: '',
				beneficiaryAccountNumber: '',
				bankCode: '',
				swiftCode: '',
			},
			transferInstructions: {
				amount: 0,
				currency: 'IDR',
				paymentDetails: '',
			},
		},
	})

	const { data: accountsResponse } = useQuery({
		queryKey: customerAccountService.getAccountList.key(),
		queryFn: () => customerAccountService.getAccountList.get({}),
		enabled: !!selectedAccount,
	})

	const currentAccount = accountsResponse?.data?.find((acc) => acc.binding_account === selectedAccount)

	const { mutate: submitDeposit, isPending: isSubmitting } = useMutation({
		mutationFn: (data: DepositFormValues) => {
			const formData = new FormData()
			formData.append('trading_account_id', currentAccount?.account_id || '')
			formData.append('payment_type', String(PaymentType.DEPOSIT))
			formData.append('currency', data.transferInstructions.currency)
			formData.append('payment_method_id', data.beneficiaryInformation.beneficiaryBankId)
			formData.append('payment_detail', data.transferInstructions.paymentDetails)
			formData.append('amount', String(data.transferInstructions.amount))

			if (data.proofOfDeposit?.file) {
				formData.append('pod_upload_document', data.proofOfDeposit.file)
			}

			formData.append('beneficiary_bank[beneficiary_bank_name]', data.beneficiaryInformation.beneficiaryBankLabel)
			formData.append('beneficiary_bank[beneficiary_account_name]', data.beneficiaryInformation.beneficiaryName)
			formData.append(
				'beneficiary_bank[beneficiary_account_number]',
				data.beneficiaryInformation.beneficiaryAccountNumber
			)
			formData.append('beneficiary_bank[beneficiary_swift_code]', data.beneficiaryInformation.swiftCode)
			formData.append('trading_account_group', currentAccount?.group || '')

			return customerDepositService.createDeposit.post({
				tradingAccountId: currentAccount?.account_id || '',
				body: formData,
			})
		},
		onSuccess: () => {
			toastUtil.success('Deposit request submitted successfully')
			router.push('/my-transactions')
		},

		onError: (error: any) => {
			toastUtil.error(error?.message || 'Failed to submit deposit request')
		},
	})

	const TRANSACTION_STEPS: ITransactionStep[] = [
		{
			control: { label: 'Step 1', sublabel: 'Deposit Request' },
			title: 'Get started with Deposit Request',
			content: (
				<DepositFormStep1
					onSuccess={() => {
						setActiveStep(1)
					}}
					onCancel={() => router.push('/my-transactions')}
				/>
			),
		},
		{
			control: { label: 'Step 2', sublabel: 'Deposit and Check' },
			title: 'Confirmation',
			disabled:
				!methods.watch('transferInstructions.amount') ||
				!methods.watch('beneficiaryInformation.beneficiaryBankId'),
			content: (
				<DepositFormStep2
					onPrevious={() => setActiveStep(0)}
					onSubmit={(data) => {
						if (!currentAccount) {
							toastUtil.warning('Please get back to transaction page and select an account')
							return
						}
						if (!data.proofOfDeposit?.file) {
							toastUtil.error('Please upload your Proof of Deposit')
							return
						}
						submitDeposit(data)
					}}
					isSubmitting={isSubmitting}
				/>
			),
		},
	]

	useEffect(() => {
		if (!selectedAccount) {
			router.push('/my-transactions')
		}
	}, [])

	useEffect(() => {
		methods.setValue('customerInformation.customerName', user?.name || user?.email || '', { shouldValidate: true })
		methods.setValue('customerInformation.tradingAccountNumber', selectedAccount || '', { shouldValidate: true })
	}, [user, selectedAccount])

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: 'Home', href: '/my-dashboard' },
					{ label: 'Transaction', href: '/my-transactions' },
					{ label: 'Make a deposit' },
				]}
			/>

			<SfiPageTitle title="Deposit Request" subtitle="Manage your deposit requests" />

			<div className="sm:border-mui-divider sm:rounded-lg sm:border sm:p-6">
				<FormProvider {...methods}>
					<TransactionStep steps={TRANSACTION_STEPS} activeStep={activeStep} onChange={setActiveStep} />
				</FormProvider>
			</div>
		</div>
	)
}

export default DepositPageView
