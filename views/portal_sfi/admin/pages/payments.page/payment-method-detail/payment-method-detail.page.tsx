'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { PaymentInstructionFormView } from '../components/new-bank-modal/payment-instruction-form-view'
import { PaymentInstructionFormValues } from '../components/new-bank-modal/payment-instruction.schema'
import { customerPaymentMethodsService } from '@/services/customer/finance/payment-methods'
import { PaymentMethodReq } from '@/services/customer/finance/payment-methods/payment-methods-res.dto'
import { CircularProgress } from '@mui/material'

import { useTranslations } from 'next-intl'
import toastUtil from '@/utils/toast'
import SfiPageTitle from '@/components/wording/page-title'

function PaymentMethodDetailPageView({ id }: { id: string }) {
	const t = useTranslations('admin.payments.form')
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data: response, isLoading: isFetching } = useQuery({
		queryKey: customerPaymentMethodsService.getPaymentMethodById.key(id),
		queryFn: () => customerPaymentMethodsService.getPaymentMethodById.get(id),
		enabled: !!id,
	})

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

	const { mutate, isPending: isSaving } = useMutation({
		mutationFn: async (values: PaymentInstructionFormValues) => {
			const payload = normalizePayload(values)
			return await customerPaymentMethodsService.updatePaymentMethod.put({
				id,
				data: payload,
			})
		},
		onSuccess: (res: any) => {
			toastUtil.success(res.message || t('messages.update_success'))
			queryClient.invalidateQueries({
				queryKey: customerPaymentMethodsService.getPaymentMethods.key(),
			})
			queryClient.invalidateQueries({
				queryKey: customerPaymentMethodsService.getPaymentMethodById.key(id),
			})
			router.push('/payments')
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || t('messages.update_error'))
		},
	})

	if (isFetching) {
		return (
			<div className="flex items-center justify-center py-20">
				<CircularProgress size="sm" />
			</div>
		)
	}

	if (!response?.data) {
		return (
			<div className="bg-mui-bg-paper border-mui-divider flex flex-col items-center justify-center rounded-xl border py-20">
				<span className="text-mui-text-secondary font-medium">{t('messages.not_found')}</span>
				<button
					onClick={() => router.push('/payments')}
					className="text-mui-primary mt-4 font-bold hover:underline"
				>
					{t('actions.go_back')}
				</button>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-6">
			<SfiPageTitle title={t('edit_title')} />
			<PaymentInstructionFormView
				data={response.data}
				onSubmit={mutate}
				onCancel={() => router.push('/payments')}
				isLoading={isFetching || isSaving}
			/>
		</div>
	)
}

export default PaymentMethodDetailPageView
