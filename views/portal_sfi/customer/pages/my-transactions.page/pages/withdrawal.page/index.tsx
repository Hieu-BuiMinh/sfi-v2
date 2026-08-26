/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryState } from 'nuqs'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { customerFinanceTransactionsService } from '@/services/customer/finance/transactions'
import { customerAccountService } from '@/services/customer/account'
import { v4 as uuidv4 } from 'uuid'
import useProfile from '@/hooks/use-profile'
import {
	withdrawalFormSchema,
	WithdrawalFormValues,
} from '@/views/portal_sfi/customer/pages/my-transactions.page/components/withdrawal-form/withdrawal-form.schema'
import { PaymentType } from '@/constants/sfi/transactions.const'
import toastUtil from '@/utils/toast'
import TransactionStep, {
	ITransactionStep,
} from '@/views/portal_sfi/customer/pages/my-transactions.page/components/transaction-step'
import WithdrawalFormStep1 from '@/views/portal_sfi/customer/pages/my-transactions.page/components/withdrawal-form/withdrawal-form-step1'
import WithdrawalFormStep2 from '@/views/portal_sfi/customer/pages/my-transactions.page/components/withdrawal-form/withdrawal-form-step2'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'

function WithdrawalPageView() {
	const router = useRouter()
	const { user } = useProfile()
	const [selectedAccount, _] = useQueryState('account')
	const [activeStep, setActiveStep] = useState(0)

	const methods = useForm<WithdrawalFormValues>({
		resolver: zodResolver(withdrawalFormSchema),
		mode: 'onChange',
		defaultValues: {
			customerInformation: {
				customerName: user?.name || '',
				tradingAccountNumber: selectedAccount || '',
			},
			beneficiaryInformation: {
				bankId: '',
				bankName: '',
				beneficiaryName: '',
				beneficiaryAccountNumber: '',
			},
			transferInformation: {
				amount: 0,
				currency: 'IDR',
				equivalentAmount: 0,
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

	const { mutate: submitWithdrawal, isPending: isSubmitting } = useMutation({
		mutationFn: (data: WithdrawalFormValues) => {
			const formData = new FormData()
			formData.append('trading_account_id', currentAccount?.account_id || '')
			formData.append('payment_type', String(PaymentType.WITHDRAWAL))
			formData.append('currency', data.transferInformation.currency)
			formData.append('payment_method_id', uuidv4())
			formData.append('payment_detail', data.transferInformation.paymentDetails)
			formData.append('amount', String(data.transferInformation.amount))
			formData.append(
				'beneficiary_bank[beneficiary_particulars_name]',
				data.beneficiaryInformation.beneficiaryName || ''
			)
			formData.append('beneficiary_bank[beneficiary_bank_name]', data.beneficiaryInformation.bankName)
			formData.append(
				'beneficiary_bank[beneficiary_account_number]',
				data.beneficiaryInformation.beneficiaryAccountNumber
			)
			formData.append('trading_account_group', currentAccount?.group || '')

			return customerFinanceTransactionsService.createWithdrawal.post({
				tradingAccountId: currentAccount?.account_id || '',
				body: formData as any,
			})
		},
		onSuccess: () => {
			toastUtil.success('Withdrawal request submitted successfully')
			router.push('/my-transactions')
		},
		onError: (error: any) => {
			toastUtil.error(error?.message || 'Failed to submit withdrawal request')
		},
	})

	const TRANSACTION_STEPS: ITransactionStep[] = [
		{
			control: { label: 'Step 1', sublabel: 'Withdrawal Request' },
			title: 'Get started with Withdrawal Request',
			content: (
				<WithdrawalFormStep1
					onSuccess={(data) => {
						// console.log('Form data:', data)
						setActiveStep(1)
					}}
				/>
			),
		},
		{
			control: { label: 'Step 2', sublabel: 'Withdrawal and Check' },
			title: 'Confirmation',
			disabled: !methods.formState.isValid,
			content: (
				<WithdrawalFormStep2
					onPrevious={() => setActiveStep(0)}
					onSubmit={(data) => {
						if (!currentAccount) {
							toastUtil.warning('Please get back to transaction page and select an account')
							return
						}
						submitWithdrawal(data)
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
					{ label: 'Withdrawal' },
				]}
			/>

			<SfiPageTitle title="Withdrawal Request" subtitle="Manage your withdrawal requests" />

			<div className="sm:border-mui-divider sm:rounded-lg sm:border sm:p-6">
				<FormProvider {...methods}>
					<TransactionStep steps={TRANSACTION_STEPS} activeStep={activeStep} onChange={setActiveStep} />
				</FormProvider>
			</div>
		</div>
	)
}

export default WithdrawalPageView
