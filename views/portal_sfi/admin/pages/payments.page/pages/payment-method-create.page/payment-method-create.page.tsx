'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from '@/utils/toast'

import { PaymentInstructionFormView } from '../../components/new-bank-modal/payment-instruction-form-view'
import { PaymentInstructionFormValues } from '../../components/new-bank-modal/payment-instruction.schema'
import { customerPaymentMethodsService } from '@/services/customer/finance/payment-methods'
import { PaymentMethodReq } from '@/services/customer/finance/payment-methods/payment-methods-res.dto'
import SfiPageTitle from '@/components/wording/page-title'

import { useTranslations } from 'next-intl'

function PaymentMethodCreatePageView() {
	const t = useTranslations('admin.payments.form')
	const router = useRouter()
	const queryClient = useQueryClient()

	const normalizePayload = (values: PaymentInstructionFormValues): PaymentMethodReq => {
		return {
			account_type: values.account_type,
			status: values.status,
			currency: values.currency,
			bank_id: values.bank_id,
			beneficiary_account_name: values.beneficiary_account_name,
			beneficiary_account_number: values.beneficiary_account_number,
			beneficiary_bank_branch_name: values.beneficiary_bank_branch_name,
			entity_id: values.entity_id,
			method: values.method,
			user_id: values.user_id,
			bank_code: values.bank_code || undefined,
			beneficiary_bank_address: values.method === 1 ? values.beneficiary_bank_address || undefined : undefined,
			beneficiary_swift_code: values.method === 1 ? values.beneficiary_swift_code || undefined : undefined,
			correspondent_bank_name: values.method === 1 ? values.correspondent_bank_name || undefined : undefined,
			correspondent_account_number:
				values.method === 1 ? values.correspondent_account_number || undefined : undefined,
			correspondent_swift_code: values.method === 1 ? values.correspondent_swift_code || undefined : undefined,
		}
	}

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: PaymentInstructionFormValues) => {
			const payload = normalizePayload(values)
			return await customerPaymentMethodsService.createPaymentMethod.post(payload)
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onSuccess: (res: any) => {
			toast.success(res.message || t('messages.create_success'))
			queryClient.invalidateQueries({
				queryKey: customerPaymentMethodsService.getPaymentMethods.key(),
			})
			router.push('/payments')
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || t('messages.create_error'))
		},
	})

	return (
		<div className="flex flex-col gap-6">
			<SfiPageTitle title={t('create_title')} />
			<PaymentInstructionFormView
				onSubmit={mutate}
				onCancel={() => router.push('/payments')}
				isLoading={isPending}
			/>
		</div>
	)
}

export default PaymentMethodCreatePageView
