'use client'

import { dashboardService } from '@/services/admin/dashboard'
import { Skeleton } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { SummaryCard } from './summary-card'
import { useRouter } from 'next/navigation'
import { AdminStatIcon } from '@/components/icons/portal/stat-icons'

export const DashboardSummary = () => {
	const t = useTranslations('admin.dashboard')
	const router = useRouter()
	const { data, isLoading } = useQuery({
		queryKey: dashboardService.getDashboardBlock.key(),
		queryFn: dashboardService.getDashboardBlock.get,
	})

	const dashboardData = data?.data

	const cards = [
		{
			title: t('cards.pending_review.title'),
			count: dashboardData?.pending_application_number ?? 0,
			subtitle: t('cards.pending_review.subtitle'),
			buttonLabel: t('cards.pending_review.button'),
			icon: <AdminStatIcon.ApplicationUnderReview className="size-9" />,
			url: '/applications?status=3',
		},
		{
			title: t('cards.processing.title'),
			count: dashboardData?.processing_application_number ?? 0,
			subtitle: t('cards.processing.subtitle'),
			buttonLabel: t('cards.processing.button'),
			icon: <AdminStatIcon.ApplicationUnderProcess className="size-9" />,
			url: '/applications?status=4',
		},
		{
			title: t('cards.deposit.title'),
			count: dashboardData?.deposit_transaction_number ?? 0,
			subtitle: t('cards.deposit.subtitle'),
			buttonLabel: t('cards.deposit.button'),
			icon: <AdminStatIcon.DepositRequest className="size-9" />,
			url: '/transactions?status=0',
		},
		{
			title: t('cards.withdrawal.title'),
			count: dashboardData?.withdrawal_transaction_number ?? 0,
			subtitle: t('cards.withdrawal.subtitle'),
			buttonLabel: t('cards.withdrawal.button'),
			icon: <AdminStatIcon.WithdrawalRequest className="size-9" />,
			url: '/transactions?status=0&tab=withdrawal',
		},
		{
			title: t('cards.data_change_request.title'),
			count: dashboardData?.pending_customer_data_change_request ?? 0,
			subtitle: t('cards.data_change_request.subtitle'),
			buttonLabel: t('cards.data_change_request.button'),
			icon: <AdminStatIcon.ApplicationUnderReview className="size-9" />,
			url: '/customers',
		},
	]

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
				{Array.from({ length: cards.length }).map((_, index) => (
					<Skeleton key={index} variant="rectangular" height={190} className="rounded-md" />
				))}
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
			{cards.map((item) => (
				<SummaryCard
					key={item.title}
					title={item.title}
					count={item.count}
					subtitle={item.subtitle}
					buttonLabel={item.buttonLabel}
					icon={item.icon}
					onClick={() => router.push(item.url)}
				/>
			))}
		</div>
	)
}
