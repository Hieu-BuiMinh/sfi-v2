'use client'

import SfiChipBase, { SfiChipBaseProps, SfiChipBaseVariant } from '@/components/chips/chip-base'
import { APPLICATION_STATUS } from '@/dto/enums/application'
import { useTranslations } from 'next-intl'

export type SfiApplicationChipProps = Omit<SfiChipBaseProps, 'label' | 'variant'> & {
	status: APPLICATION_STATUS
}

export const APPLICATION_STATUS_COLOR: Record<APPLICATION_STATUS, SfiChipBaseVariant> = {
	[APPLICATION_STATUS.STATUS_NOT_STARTED]: 'secondary',
	[APPLICATION_STATUS.STATUS_FILLING]: 'warning',
	[APPLICATION_STATUS.STATUS_PROCESSING]: 'info',
	[APPLICATION_STATUS.STATUS_APPROVE]: 'success',
	[APPLICATION_STATUS.STATUS_REJECT]: 'error',
}

export default function SfiApplicationChip({ status, ...props }: SfiApplicationChipProps) {
	const t = useTranslations('components.chip.application_status')
	const labels: Record<APPLICATION_STATUS, string> = {
		[APPLICATION_STATUS.STATUS_NOT_STARTED]: t('not_started'),
		[APPLICATION_STATUS.STATUS_PENDING]: t('pending'),
		[APPLICATION_STATUS.STATUS_PROCESSING]: t('processing'),
		[APPLICATION_STATUS.STATUS_APPROVE]: t('approved'),
		[APPLICATION_STATUS.STATUS_REJECT]: t('rejected'),
	}

	return (
		<SfiChipBase
			label={labels[status] || t('unknown')}
			variant={APPLICATION_STATUS_COLOR[status] || 'secondary'}
			{...props}
		/>
	)
}
