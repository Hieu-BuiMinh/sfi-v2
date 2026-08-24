'use client'

import { customerPaymentMethodsService } from '@/services/customer/finance/payment-methods'
import {
	PAYMENT_ACCOUNT_TYPE,
	PAYMENT_METHOD_STATUS,
	PAYMENT_METHOD_TYPE,
	PaymentMethodItem,
} from '@/services/customer/finance/payment-methods/payment-methods-res.dto'
import { Button } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import PaymentMethodCard from './components/payment-method-card'

import { useTranslations } from 'next-intl'
import toastUtil from '@/utils/toast'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import SfiCommonModal from '@/components/modals/common-modal'

function AdminPaymentsPageView() {
	const t = useTranslations('admin.payments.list')
	const commonT = useTranslations('common.button_text')
	const router = useRouter()
	const queryClient = useQueryClient()
	const [selectedMethod, setSelectedMethod] = useState<string>('all')
	const [selectedAccountType, setSelectedAccountType] = useState<string>('all')
	const [selectedStatus, setSelectedStatus] = useState<string>('all')

	const [deleteId, setDeleteId] = useState<string | null>(null)

	const { data: response, isLoading } = useQuery({
		queryKey: customerPaymentMethodsService.getPaymentMethods.key(),
		queryFn: () => customerPaymentMethodsService.getPaymentMethods.get(),
	})

	const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
		mutationFn: (id: string) => customerPaymentMethodsService.deletePaymentMethod.delete(id),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onSuccess: (res: any) => {
			toastUtil.success(res.message || t('messages.delete_success'))
			queryClient.invalidateQueries({
				queryKey: customerPaymentMethodsService.getPaymentMethods.key(),
			})
			setDeleteId(null)
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || t('messages.delete_error'))
		},
	})

	const handleOpenCreate = () => {
		router.push('/payments/create')
	}

	const handleOpenEdit = (id: string) => {
		router.push(`/payments/${id}`)
	}

	const handleDeleteConfirm = () => {
		if (deleteId) {
			deleteMutate(deleteId)
		}
	}

	const paymentMethods = useMemo(() => {
		let data = response?.data || []

		if (selectedMethod !== 'all') {
			data = data.filter((item: PaymentMethodItem) => item.method.toString() === selectedMethod)
		}

		if (selectedAccountType !== 'all') {
			data = data.filter((item: PaymentMethodItem) => item.account_type.toString() === selectedAccountType)
		}

		if (selectedStatus !== 'all') {
			data = data.filter((item: PaymentMethodItem) => item.status.toString() === selectedStatus)
		}

		return data
	}, [response, selectedMethod, selectedAccountType, selectedStatus])

	const methodOptions = useMemo(
		() => [
			{ label: t('filter.method_options.all'), value: 'all' },
			{
				label: t('filter.method_options.wire'),
				value: PAYMENT_METHOD_TYPE.WIRE.toString(),
			},
			{
				label: t('filter.method_options.domestic'),
				value: PAYMENT_METHOD_TYPE.DOMESTIC.toString(),
			},
		],
		[t]
	)

	const accountTypeOptions = useMemo(
		() => [
			{ label: t('filter.account_type_options.all'), value: 'all' },
			{
				label: t('filter.account_type_options.individual'),
				value: PAYMENT_ACCOUNT_TYPE.INDIVIDUAL.toString(),
			},
			{
				label: t('filter.account_type_options.corporate'),
				value: PAYMENT_ACCOUNT_TYPE.CORPORATE.toString(),
			},
		],
		[t]
	)

	const statusOptions = useMemo(
		() => [
			{ label: t('filter.status_options.all'), value: 'all' },
			{
				label: t('filter.status_options.active'),
				value: PAYMENT_METHOD_STATUS.ACTIVE.toString(),
			},
			{
				label: t('filter.status_options.inactive'),
				value: PAYMENT_METHOD_STATUS.INACTIVE.toString(),
			},
		],
		[t]
	)

	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[{ label: t('breadcrumb.admin'), href: '/dashboard' }, { label: t('breadcrumb.customer_list') }]}
			/>

			<SfiPageTitle
				title={
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex flex-wrap items-center gap-6">
							<span className="text-2xl font-bold">{t('title')}</span>
							<SfiSingleSelect
								size="medium"
								value={selectedMethod}
								onChange={(e) => setSelectedMethod(e.target.value as string)}
								options={methodOptions}
								containerClassName="min-w-[180px]"
							/>
						</div>

						<Button variant="contained" onClick={handleOpenCreate}>
							{t('add_new')}
						</Button>
					</div>
				}
			/>

			<div className="flex flex-wrap items-center gap-3">
				<span className="text-mui-text-secondary text-sm font-medium">{t('filter.accepted_with')}</span>
				<SfiSingleSelect
					size="medium"
					value={selectedAccountType}
					onChange={(e) => setSelectedAccountType(e.target.value as string)}
					options={accountTypeOptions}
					containerClassName="min-w-[150px]"
				/>
				<span className="text-mui-text-secondary text-sm font-medium">{t('filter.status')}</span>
				<SfiSingleSelect
					size="medium"
					value={selectedStatus}
					onChange={(e) => setSelectedStatus(e.target.value as string)}
					options={statusOptions}
					containerClassName="min-w-[150px]"
				/>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="bg-mui-bg-paper border-mui-divider h-87.5 animate-pulse rounded-xl border"
						/>
					))}
				</div>
			) : paymentMethods.length > 0 ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{paymentMethods.map((item: PaymentMethodItem) => (
						<PaymentMethodCard
							key={item.id}
							data={item}
							onClick={(id: string) => router.push(`/payments/${id}`)}
							onEdit={handleOpenEdit}
							onDelete={(id: string) => setDeleteId(id)}
						/>
					))}
				</div>
			) : (
				<div className="bg-mui-bg-paper border-mui-divider flex flex-col items-center justify-center rounded-xl border py-20 shadow-sm">
					<span className="text-mui-text-secondary font-medium">{t('empty')}</span>
				</div>
			)}

			<SfiCommonModal
				open={!!deleteId}
				onClose={() => setDeleteId(null)}
				title={t('delete_dialog.title')}
				maxWidth="xs"
				confirmBtn={{
					label: t('delete_dialog.confirm'),
					onClick: handleDeleteConfirm,
					loading: isDeleting,
					color: 'error',
				}}
				cancelBtn={{
					label: commonT('cancel'),
					disabled: isDeleting,
					color: 'primary',
				}}
			>
				<div>
					<p className="text-mui-text-primary mb-2">{t('delete_dialog.description')}</p>
					<p className="text-mui-text-secondary text-sm">{t('delete_dialog.description_footer')}</p>
				</div>
			</SfiCommonModal>
		</div>
	)
}

export default AdminPaymentsPageView
