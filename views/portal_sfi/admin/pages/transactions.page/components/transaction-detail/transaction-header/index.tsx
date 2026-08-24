import { Divider, Chip } from '@mui/material'
import React from 'react'
import { TDepositApproval, TTransaction } from '@/services/admin/finance/transactions/transactions-res.dto'
import dayjs from 'dayjs'
import { cn } from '@/utils/cn'
import { useTranslations } from 'next-intl'
import SfiTransactionStatusChip from '@/components/chips/transaction-status-chip'

interface TransactionHeaderProps {
	data?: TTransaction
	approval?: TDepositApproval | null
}

function TransactionHeader({ data, approval }: TransactionHeaderProps) {
	const t = useTranslations('admin.transactions.detail.header')
	const displayApproval = approval || data?.sfi_deposit_approval || data?.sfi_withdraw_approval

	return (
		<div className="text-mui-text-secondary flex flex-wrap items-center gap-3 text-xs md:text-sm">
			<div className="flex items-center gap-1">
				<span className="font-medium">{t('created_date')}:</span>
				<span className="text-mui-text-primary">
					{data?.created_at ? dayjs(data.created_at * 1000).format('DD/MM/YYYY HH:mm') : '-'}
				</span>
			</div>
			<Divider orientation="vertical" flexItem />
			<div className="flex items-center gap-1">
				<span className="font-medium">{t('request_type')}:</span>
				<Chip
					label={data?.payment_type === 1 ? t('deposit') : t('withdraw')}
					size="small"
					className={cn(
						'border transition-colors',
						data?.payment_type === 1
							? 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400'
							: 'border-orange-100 bg-orange-50 text-orange-600 dark:border-orange-900/50 dark:bg-orange-500/10 dark:text-orange-400'
					)}
					sx={{ height: 20, fontSize: '0.75rem', borderRadius: '4px' }}
				/>
			</div>
			<Divider orientation="vertical" flexItem />
			<div className="flex items-center gap-1">
				<span className="font-medium">{t('status')}:</span>
				{data ? (
					<SfiTransactionStatusChip status={data.status} />
				) : (
					<span className="text-mui-text-primary">-</span>
				)}
			</div>
			<Divider orientation="vertical" flexItem />
			<div className="flex items-center gap-1">
				<span className="font-medium">{t('approved_date')}:</span>
				<span className="text-mui-text-primary">
					{displayApproval?.user_updated_at
						? dayjs(displayApproval.user_updated_at * 1000).format('DD/MM/YYYY HH:mm')
						: '-'}
				</span>
			</div>
			<Divider orientation="vertical" flexItem />
			<div className="flex items-center gap-1">
				<span className="font-medium">{t('process_by')}:</span>
				<span className="text-mui-text-primary">{displayApproval?.user_approve?.email || '-'}</span>
			</div>
		</div>
	)
}

export default TransactionHeader
