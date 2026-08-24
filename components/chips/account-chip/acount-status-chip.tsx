'use client'

import SfiChipBase, { SfiChipBaseProps } from '@/components/chips/chip-base'
import { useTranslations } from 'next-intl'

export interface AccountStatusSfiChipProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	active: boolean
}

export default function AccountStatusSfiChip({ active, ...props }: AccountStatusSfiChipProps) {
	const t = useTranslations('components.chip.account_status')

	return (
		<SfiChipBase
			label={active ? t('active') : t('inactive')}
			variant={active ? 'success' : 'secondary'}
			{...props}
		/>
	)
}
