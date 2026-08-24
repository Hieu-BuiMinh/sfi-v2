/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import SfiCommonModal from '@/components/modals/common-modal'
import { TRANSACTION_STATUS } from '@/constants/sfi/transactions.const'
import { adminFinanceTransactionService } from '@/services/admin/finance/transactions'
import { TTransaction } from '@/services/admin/finance/transactions/transactions-res.dto'
import { formatMoney, TCurrency } from '@/utils/money'
import toastUtil from '@/utils/toast'
import { Button, Skeleton, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface TransactionApproveButtonProps {
	transaction: TTransaction
	type: 'deposit' | 'withdraw'
	userReceivedAmount?: number | string | null
	userVerifiedAmount?: number | string | null
}

function TransactionApproveButton({
	transaction,
	type,
	userReceivedAmount,
	userVerifiedAmount,
}: TransactionApproveButtonProps) {
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()
	const transactionId = transaction.id
	const entityId = transaction.entity_id

	const isPending = transaction.status === TRANSACTION_STATUS.PENDING
	const isDeposit = type === 'deposit'

	const { data: verifiedAmountRes, isLoading: isFetchingVerifiedAmount } = useQuery({
		queryKey: adminFinanceTransactionService.getVerifiedAmount.key({
			amount: Number(userReceivedAmount ?? transaction.amount) || 0,
			quote_currency: transaction.currency || 'IDR',
			rate_type: 1,
			base_currency: 'USD',
		}),
		queryFn: () =>
			adminFinanceTransactionService.getVerifiedAmount.get({
				amount: Number(userReceivedAmount ?? transaction.amount) || 0,
				quote_currency: transaction.currency || 'IDR',
				rate_type: 1,
				base_currency: 'USD',
			}),
		enabled: open && isPending,
	})

	const displayVerifiedAmount =
		verifiedAmountRes?.data?.verified_amount ?? userVerifiedAmount ?? transaction.verified_amount

	const { mutate, isPending: isSubmitting } = useMutation({
		mutationFn: isDeposit
			? adminFinanceTransactionService.updateTransactionApprovalStatus.post
			: adminFinanceTransactionService.updateWithdrawalTransactionStatus.post,
		onSuccess: (res) => {
			if (res.status === 'success') {
				toastUtil.success(`${isDeposit ? 'Deposit' : 'Withdrawal'} approved successfully`)
				const queryKeyDetail = isDeposit
					? adminFinanceTransactionService.getDepositTransactionDetail.key(transactionId)
					: adminFinanceTransactionService.getWithdrawalTransactionDetail.key(transactionId)

				const queryKeyHistory = isDeposit
					? ['get_deposit_approval_history', entityId, transactionId]
					: ['get_withdrawal_approval_history', entityId, transactionId]

				queryClient.invalidateQueries({ queryKey: queryKeyDetail })
				queryClient.invalidateQueries({ queryKey: queryKeyHistory })
				setOpen(false)
			} else {
				toastUtil.error(res.message || 'Failed to approve transaction')
			}
		},
		onError: (err: any) => {
			toastUtil.error(err?.message || 'Something went wrong')
		},
	})

	const handleApprove = () => {
		mutate({
			entity_id: entityId,
			transaction_id: transactionId,
			user_approval_status: 1,
			user_remarked: '',
			user_received_amount: userReceivedAmount ?? transaction.amount,
			user_verified_amount: displayVerifiedAmount,
		})
	}

	return (
		<>
			<Button
				variant="contained"
				color="primary"
				onClick={() => setOpen(true)}
				className="min-w-25"
				disabled={!isPending}
			>
				Approve
			</Button>

			<SfiCommonModal
				open={open}
				onClose={() => setOpen(false)}
				title={`Approve this transaction`}
				maxWidth="xs"
				confirmBtn={{
					label: 'Confirm',
					onClick: handleApprove,
					loading: isSubmitting,
				}}
				cancelBtn={{
					label: 'Cancel',
					disabled: isSubmitting,
				}}
			>
				<div className="flex flex-col gap-4">
					<Typography variant="body2" className="text-mui-text-secondary">
						{isDeposit
							? 'Once approved, the customer will be notified, and the incoming funds will appear in their trading account.'
							: 'Once approved, the funds will be processed for transfer, and the user will be notified.'}
					</Typography>

					<div className="flex flex-col gap-3">
						<div className="flex items-baseline justify-between gap-4">
							<Typography variant="caption" className="text-mui-text-secondary">
								{isDeposit ? 'Deposit amount:' : 'Withdrawal amount:'}
							</Typography>
							<Typography variant="body2" className="font-medium text-blue-600 dark:text-blue-400">
								{formatMoney(transaction.amount, {
									currency: transaction.currency as TCurrency,
									showCode: true,
								})}
							</Typography>
						</div>

						{isDeposit && (
							<div className="flex items-baseline justify-between gap-4">
								<Typography variant="caption" className="text-mui-text-secondary">
									Total amount received:
								</Typography>
								<Typography variant="body2" className="text-mui-error font-semibold">
									{formatMoney((userReceivedAmount ?? transaction.amount) || 0, {
										currency: (transaction.currency || 'IDR') as TCurrency,
										showCode: true,
									})}
								</Typography>
							</div>
						)}

						<div className="flex items-baseline justify-between gap-4">
							<Typography variant="caption" className="text-mui-text-secondary">
								Verified amount (USD):
							</Typography>
							{isFetchingVerifiedAmount && !displayVerifiedAmount ? (
								<Skeleton width={80} height={24} />
							) : (
								<Typography variant="body2" className="text-mui-error font-semibold">
									{formatMoney(displayVerifiedAmount || 0, {
										currency: 'USD',
										showCode: true,
									})}
								</Typography>
							)}
						</div>
					</div>
				</div>
			</SfiCommonModal>
		</>
	)
}

export default TransactionApproveButton
