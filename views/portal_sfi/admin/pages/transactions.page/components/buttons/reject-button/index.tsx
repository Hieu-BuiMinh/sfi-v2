'use client'

import { Button, Typography, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminFinanceTransactionService } from '@/services/admin/finance/transactions'

import { TTransaction } from '@/services/admin/finance/transactions/transactions-res.dto'
import { TRANSACTION_STATUS } from '@/constants/sfi/transactions.const'
import toastUtil from '@/utils/toast'
import SfiCommonModal from '@/components/modals/common-modal'

interface TransactionRejectButtonProps {
	transaction: TTransaction
	type: 'deposit' | 'withdraw'
}

function TransactionRejectButton({ transaction, type }: TransactionRejectButtonProps) {
	const [open, setOpen] = useState(false)
	const [remark, setRemark] = useState('')
	const queryClient = useQueryClient()
	const transactionId = transaction.id
	const entityId = transaction.entity_id

	const isPending = transaction.status === TRANSACTION_STATUS.PENDING
	const isDeposit = type === 'deposit'

	const { mutate, isPending: isSubmitting } = useMutation({
		mutationFn: isDeposit
			? adminFinanceTransactionService.updateTransactionApprovalStatus.post
			: adminFinanceTransactionService.updateWithdrawalTransactionStatus.post,
		onSuccess: (res) => {
			if (res.status === 'success') {
				toastUtil.success(`${isDeposit ? 'Deposit' : 'Withdrawal'} rejected successfully`)
				const queryKeyDetail = isDeposit
					? adminFinanceTransactionService.getDepositTransactionDetail.key(transactionId)
					: adminFinanceTransactionService.getWithdrawalTransactionDetail.key(transactionId)

				const queryKeyHistory = isDeposit
					? ['get_deposit_approval_history', entityId, transactionId]
					: ['get_withdrawal_approval_history', entityId, transactionId]

				queryClient.invalidateQueries({ queryKey: queryKeyDetail })
				queryClient.invalidateQueries({ queryKey: queryKeyHistory })
				setOpen(false)
				setRemark('')
			} else {
				toastUtil.error(res.message || 'Failed to reject transaction')
			}
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (err: any) => {
			toastUtil.error(err?.message || 'Something went wrong')
		},
	})

	const handleReject = () => {
		if (!remark.trim()) {
			toastUtil.error('Reason for rejection is required')
			return
		}

		mutate({
			entity_id: entityId,
			transaction_id: transactionId,
			user_approval_status: 0,
			user_remarked: remark,
		})
	}

	return (
		<>
			<Button
				variant="contained"
				color="error"
				onClick={() => setOpen(true)}
				className="min-w-25"
				disabled={!isPending}
			>
				Reject
			</Button>

			<SfiCommonModal
				open={open}
				onClose={() => setOpen(false)}
				title="Reject this transaction"
				maxWidth="xs"
				confirmBtn={{
					label: 'Confirm',
					onClick: handleReject,
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
							? 'Once rejected, the transaction will not be processed further, and the user will be notified of the decision.'
							: 'You are about to reject this transaction. This action will prevent further processing and notify the relevant parties.'}
					</Typography>

					<div className="flex flex-col gap-2">
						<Typography variant="caption" className="font-semibold">
							Reason for rejection *
						</Typography>
						<TextField
							fullWidth
							multiline
							rows={3}
							placeholder="Remark Reject *"
							value={remark}
							onChange={(e) => setRemark(e.target.value)}
							disabled={isSubmitting}
							variant="outlined"
							size="small"
							error={open && !remark.trim()}
						/>
					</div>
				</div>
			</SfiCommonModal>
		</>
	)
}

export default TransactionRejectButton
