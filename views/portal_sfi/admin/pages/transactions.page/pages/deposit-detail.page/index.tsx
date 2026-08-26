'use client'

import { adminFinanceTransactionService } from '@/services/admin/finance/transactions'
import { formatMoney, TCurrency } from '@/utils/money'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, InputAdornment, Skeleton, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { useTranslations } from 'next-intl'
import { TRANSACTION_STATUS } from '@/constants/sfi/transactions.const'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import TransactionHeader from '@/views/portal_sfi/admin/pages/transactions.page/components/transaction-detail/transaction-header'
import TransactionRejectMessage from '@/views/portal_sfi/admin/pages/transactions.page/components/reject-message'
import TransactionDetailSection from '@/views/portal_sfi/admin/pages/transactions.page/components/transaction-detail/transaction-detail-section'
import TransactionDetailField from '@/views/portal_sfi/admin/pages/transactions.page/components/transaction-detail/transaction-detail-field'
import PodFileItem from '@/views/portal_sfi/admin/pages/transactions.page/components/transaction-detail/pod-file-item'
import AccountTypeChip from '@/components/chips/account-chip/account-type-chip'
import TransactionApproveButton from '@/views/portal_sfi/admin/pages/transactions.page/components/buttons/approve-button'
import TransactionRejectButton from '@/views/portal_sfi/admin/pages/transactions.page/components/buttons/reject-button'

function DepositDetailPageView({ id }: { id: string }) {
	const t = useTranslations('admin.transactions.detail')
	const tList = useTranslations('admin.transactions.list')
	const { data: transactionRes, isLoading: isFetchingTransaction } = useQuery({
		queryKey: adminFinanceTransactionService.getDepositTransactionDetail.key(id),
		queryFn: () => adminFinanceTransactionService.getDepositTransactionDetail.get(id),
	})

	const transaction = transactionRes?.data
	const isPending = transaction?.status === TRANSACTION_STATUS.PENDING

	const [internalAmount, setInternalAmount] = React.useState<number | string>(transaction?.amount || 0)
	const [isEditingAmount, setIsEditingAmount] = React.useState(false)
	const [tempAmount, setTempAmount] = React.useState<number | string>(transaction?.amount || 0)

	React.useEffect(() => {
		if (transaction?.amount) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setInternalAmount(transaction.amount)
			setTempAmount(transaction.amount)
		}
	}, [transaction?.amount])

	const { data: verifiedAmountRes, isLoading: isFetchingVerifiedAmount } = useQuery({
		queryKey: adminFinanceTransactionService.getVerifiedAmount.key({
			amount: Number(isEditingAmount ? tempAmount : internalAmount) || 0,
			quote_currency: transaction?.currency || 'IDR',
			rate_type: 1,
			base_currency: 'USD',
		}),
		queryFn: () =>
			adminFinanceTransactionService.getVerifiedAmount.get({
				amount: Number(isEditingAmount ? tempAmount : internalAmount) || 0,
				quote_currency: transaction?.currency || 'IDR',
				rate_type: 1,
				base_currency: 'USD',
			}),
		enabled: !!transaction && isPending,
	})

	const verifiedAmount = verifiedAmountRes?.data?.verified_amount ?? transaction?.verified_amount

	const { data: approvalHistoryRes } = useQuery({
		queryKey: adminFinanceTransactionService.getDepositApprovalHistory.key({
			entity_id: transaction?.entity_id || '',
			transaction_id: id,
		}),
		queryFn: () =>
			adminFinanceTransactionService.getDepositApprovalHistory.get({
				entity_id: transaction?.entity_id || '',
				transaction_id: id,
			}),
		enabled: !!transaction?.entity_id,
	})

	const latestApproval = approvalHistoryRes?.data?.[0]

	if (isFetchingTransaction) {
		return (
			<div className="flex flex-col gap-5">
				<Skeleton variant="rectangular" height={40} width={200} />
				<Skeleton variant="rectangular" height={60} />
				<Skeleton variant="rectangular" height={40} />
				<div className="flex flex-col gap-6">
					<Skeleton variant="rectangular" height={200} />
					<Skeleton variant="rectangular" height={200} />
				</div>
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
						href: '/transactions',
					},
					{ label: t('breadcrumb.deposit') },
				]}
			/>

			<SfiPageTitle
				title={
					<div className="flex w-full items-center justify-between">
						<span>{t('title')}</span>
						<div className="flex items-center gap-2">
							{transaction && (
								<TransactionApproveButton
									transaction={transaction}
									type="deposit"
									userReceivedAmount={internalAmount}
									userVerifiedAmount={verifiedAmount}
								/>
							)}
							{transaction && <TransactionRejectButton transaction={transaction} type="deposit" />}
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

				{/* Section 2: Request Information */}
				<TransactionDetailSection title={t('sections.request_info')}>
					<div className="flex flex-col gap-4">
						<h4 className="text-mui-text-secondary text-sm font-medium">{t('fields.bank_info_title')}</h4>
						<div className="flex flex-col">
							<TransactionDetailField
								label={t('fields.bank_name')}
								value={transaction?.beneficiary_bank?.beneficiary_bank_name}
							/>
							<TransactionDetailField
								label={t('fields.beneficiary_name')}
								value={transaction?.beneficiary_bank?.beneficiary_account_name}
							/>
							<TransactionDetailField
								label={t('fields.beneficiary_number')}
								value={transaction?.beneficiary_bank?.beneficiary_account_number}
							/>
							<TransactionDetailField
								label={t('fields.beneficiary_swift')}
								value={transaction?.beneficiary_bank?.beneficiary_swift_code}
							/>
						</div>
					</div>
				</TransactionDetailSection>

				{/* Section 3: Proof of Deposit (POD) */}
				<TransactionDetailSection title={t('sections.pod')}>
					{transaction?.pod_upload_document ? (
						<div className="flex min-w-0 flex-col gap-3">
							<PodFileItem
								fileName={transaction.pod_upload_document.split('/').pop() || t('fields.pod_fallback')}
								url={transaction.pod_upload_document}
							/>
						</div>
					) : (
						<span className="text-mui-text-secondary text-sm italic">{t('fields.no_file')}</span>
					)}
				</TransactionDetailSection>

				{/* Section 4: Fund Information */}
				<TransactionDetailSection title={t('sections.fund_info')}>
					<div className="flex flex-col">
						<TransactionDetailField
							label={t('fields.payment_details')}
							value={transaction?.payment_detail}
						/>
						<TransactionDetailField
							label={tList('table.columns.deposit_amount')}
							value={formatMoney(transaction?.amount || 0, {
								currency: transaction?.currency as TCurrency,
								showCode: true,
							})}
						/>
						<TransactionDetailField
							label={t('fields.amount_receive')}
							value={
								<div className="flex items-center gap-2">
									{isEditingAmount ? (
										<TextField
											size="small"
											value={tempAmount}
											onChange={(e) => setTempAmount(e.target.value)}
											type="number"
											variant="standard"
											slotProps={{
												input: {
													endAdornment: (
														<InputAdornment position="end">
															<span className="text-xs font-semibold">
																{transaction?.currency}
															</span>
														</InputAdornment>
													),
												},
											}}
											className="w-40"
										/>
									) : (
										<span className="font-bold">
											{formatMoney(internalAmount || 0, {
												currency: (transaction?.currency as TCurrency) || 'USD',
												showCode: true,
											})}
										</span>
									)}

									{isPending && (
										<div className="flex items-center">
											{isEditingAmount ? (
												<>
													<IconButton
														size="small"
														color="primary"
														onClick={() => {
															setInternalAmount(tempAmount)
															setIsEditingAmount(false)
														}}
													>
														<CheckIcon fontSize="small" />
													</IconButton>
													<IconButton
														size="small"
														color="error"
														onClick={() => {
															setTempAmount(internalAmount)
															setIsEditingAmount(false)
														}}
													>
														<CloseIcon fontSize="small" />
													</IconButton>
												</>
											) : (
												<IconButton size="small" onClick={() => setIsEditingAmount(true)}>
													<EditIcon fontSize="small" />
												</IconButton>
											)}
										</div>
									)}
								</div>
							}
						/>
						<TransactionDetailField
							label={t('fields.verified_amount')}
							value={
								isFetchingVerifiedAmount ? (
									<Skeleton width={80} height={20} />
								) : (
									formatMoney(verifiedAmount || 0, {
										currency: 'USD',
										showCode: true,
									})
								)
							}
							valueClassName="font-bold text-mui-error"
						/>
					</div>
				</TransactionDetailSection>
			</div>
		</div>
	)
}

export default DepositDetailPageView
