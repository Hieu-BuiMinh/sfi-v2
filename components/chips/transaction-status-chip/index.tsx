'use client'

import SfiChipBase, { SfiChipBaseProps, SfiChipBaseVariant } from '@/components/chips/chip-base'
import { TRANSACTION_STATUS } from '@/constants/sfi/transactions.const'
import { useTranslations } from 'next-intl'

export type SfiTransactionStatusChipProps = Omit<SfiChipBaseProps, 'label' | 'variant'> & {
	status: TRANSACTION_STATUS | number
}

export const TRANSACTION_STATUS_COLOR: Record<TRANSACTION_STATUS, SfiChipBaseVariant> = {
	[TRANSACTION_STATUS.PENDING]: 'warning',
	[TRANSACTION_STATUS.APPROVED]: 'success',
	[TRANSACTION_STATUS.PROCESSING]: 'info',
	[TRANSACTION_STATUS.REJECTED]: 'error',
}

export default function SfiTransactionStatusChip({ status, ...props }: SfiTransactionStatusChipProps) {
	const t = useTranslations('components.chip.transaction_status')
	const currentStatus = status as TRANSACTION_STATUS
	const labels: Record<TRANSACTION_STATUS, string> = {
		[TRANSACTION_STATUS.PENDING]: t('pending'),
		[TRANSACTION_STATUS.APPROVED]: t('approved'),
		[TRANSACTION_STATUS.PROCESSING]: t('processing'),
		[TRANSACTION_STATUS.REJECTED]: t('rejected'),
	}

	return (
		<SfiChipBase
			label={labels[currentStatus] || t('unknown')}
			variant={TRANSACTION_STATUS_COLOR[currentStatus] || 'secondary'}
			{...props}
		/>
	)
}
