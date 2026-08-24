'use client'

import SfiChipBase, { SfiChipBaseProps } from '@/components/chips/chip-base'
import { ERateStatus } from '@/services/admin/finance/rates/rates-res.dto'
import { useTranslations } from 'next-intl'

export interface RatesStatusChipProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	status: ERateStatus | number
}

export default function RatesStatusChip({ status, ...props }: RatesStatusChipProps) {
	const t = useTranslations('components.chip.rate_status')
	const enabled = status === ERateStatus.ENABLE

	return (
		<SfiChipBase
			label={enabled ? t('enable') : t('disable')}
			variant={enabled ? 'success' : 'secondary'}
			{...props}
		/>
	)
}
