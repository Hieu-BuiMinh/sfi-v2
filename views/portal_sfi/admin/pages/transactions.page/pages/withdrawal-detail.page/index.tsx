'use client'

import { Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { adminFinanceTransactionService } from '@/services/admin/finance/transactions'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import TransactionApproveButton from '@/views/portal_sfi/admin/pages/transactions.page/components/buttons/approve-button'
import TransactionHeader from '@/views/portal_sfi/admin/pages/transactions.page/components/transaction-detail/transaction-header'
import TransactionRejectMessage from '@/views/portal_sfi/admin/pages/transactions.page/components/reject-message'
import TransactionDetailSection from '@/views/portal_sfi/admin/pages/transactions.page/components/transaction-detail/transaction-detail-section'
import TransactionDetailField from '@/views/portal_sfi/admin/pages/transactions.page/components/transaction-detail/transaction-detail-field'
import AccountTypeChip from '@/components/chips/account-chip/account-type-chip'
import { formatMoney, TCurrency } from '@/utils/money'
import TransactionRejectButton from '@/views/portal_sfi/admin/pages/transactions.page/components/buttons/reject-button'

function WithdrawalDetailPageView({ id }: { id: string }) {
	const t = useTranslations('admin.transactions.detail')
	const tList = useTranslations('admin.transactions.list')
	const { data: transactionRes, isLoading: isFetchingTransaction } = useQuery({
		queryKey: adminFinanceTransactionService.getWithdrawalTransactionDetail.key(id),

		queryFn: () => adminFinanceTransactionService.getWithdrawalTransactionDetail.get(id),
	})

	const transaction = transactionRes?.data

	const { data: approvalHistoryRes } = useQuery({
		queryKey: adminFinanceTransactionService.getWithdrawalApprovalHistory.key({
			entity_id: transaction?.entity_id || '',
			transaction_id: id,
		}),
		queryFn: () =>
			adminFinanceTransactionService.getWithdrawalApprovalHistory.get({
				entity_id: transaction?.entity_id || '',
				transaction_id: id,
			}),
		enabled: !!transaction?.entity_id,
	})

	const latestApproval = useMemo(() => {
		if (!approvalHistoryRes?.data || approvalHistoryRes.data.length === 0) return null
		return approvalHistoryRes.data[0]
	}, [approvalHistoryRes])

	if (isFetchingTransaction) {
		return (
			<div className="flex flex-col gap-5 p-6">
				<Skeleton variant="text" width={200} height={32} />
				<Skeleton variant="rectangular" width="100%" height={100} />
				<Skeleton variant="rectangular" width="100%" height={400} />
			</div>
		)
	}

	return (
		<div className="flex max-w-full min-w-0 flex-col gap-5 overflow-hidden">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.admin'), href: '/dashboard' },
					{
						label: t('breadcrumb.transaction_list'),
						href: '/transactions?tab=withdrawal',
					},
					{ label: t('breadcrumb.withdrawal') },
				]}
			/>

			<SfiPageTitle
				title={
					<div className="flex items-center justify-between">
						<span>{t('title')}</span>
						<div className="flex items-center gap-2">
							{transaction && <TransactionApproveButton transaction={transaction} type="withdraw" />}
							{transaction && <TransactionRejectButton transaction={transaction} type="withdraw" />}
						</div>
					</div>
				}
				subtitle={id}
			/>

			<TransactionHeader data={transaction} approval={latestApproval} />

			{latestApproval?.user_remarked && <TransactionRejectMessage message={latestApproval.user_remarked} />}

			<div className="flex max-w-full min-w-0 flex-col gap-6">
				{/* Section 1: Customer Information */}
				<TransactionDetailSection title={t('sections.customer_info')}>
					<div className="flex flex-col">
						<TransactionDetailField label={t('fields.email')} value={transaction?.user?.email} />
						<TransactionDetailField label={t('fields.name')} value={transaction?.user?.name} />
						<TransactionDetailField
							label={t('fields.trading_account')}
							value={transaction?.trading_account_id}
						/>
						<TransactionDetailField
							label={t('fields.account_type')}
							value={<AccountTypeChip type={transaction?.trading_account_group || ''} />}
						/>
					</div>
				</TransactionDetailSection>

				{/* Section 2: Beneficiary bank information */}
				<TransactionDetailSection title={t('sections.beneficiary_info')}>
					<div className="flex flex-col">
						<TransactionDetailField
							label={t('fields.bank_name')}
							value={transaction?.beneficiary_bank?.beneficiary_bank_name}
						/>
						<TransactionDetailField
							label={t('fields.beneficiary_name')}
							value={transaction?.beneficiary_bank?.beneficiary_particulars_name}
						/>
						<TransactionDetailField
							label={t('fields.beneficiary_number')}
							value={transaction?.beneficiary_bank?.beneficiary_account_number}
						/>
						<TransactionDetailField label={t('fields.beneficiary_branch')} value="_" />
					</div>
				</TransactionDetailSection>

				{/* Section 3: Fund information */}
				<TransactionDetailSection title={t('sections.fund_info')}>
					<div className="flex flex-col gap-3">
						<TransactionDetailField
							label={t('fields.payment_details')}
							value={transaction?.payment_detail || '-'}
						/>
						<TransactionDetailField
							label={tList('table.columns.withdrawal_amount')}
							value={formatMoney(transaction?.amount || 0, {
								currency: (transaction?.currency as TCurrency) || 'USD',
								showCode: true,
							})}
							valueClassName="font-bold text-mui-primary"
						/>
						<TransactionDetailField
							label={t('fields.verified_amount')}
							value={formatMoney(transaction?.verified_amount || 0, {
								currency: 'USD',
								showCode: true,
							})}
							valueClassName="font-bold text-mui-error"
						/>
					</div>
				</TransactionDetailSection>
			</div>
		</div>
	)
}

export default WithdrawalDetailPageView
