'use client'

import SfiChipBase, { SfiChipBaseProps } from '@/components/chips/chip-base'
import { useTranslations } from 'next-intl'

export interface AccountTypeChipProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	type: 'LIVE' | 'DEMO' | string
}

export default function AccountTypeChip({ type, ...props }: AccountTypeChipProps) {
	const t = useTranslations('components.chip.account_type')
	const upperType = type.toUpperCase()
	const isLive = upperType.includes('LIVE')
	const isDemo = upperType.includes('DEMO')

	if (!isLive && !isDemo) return null

	return <SfiChipBase label={isLive ? t('live') : t('demo')} variant={isLive ? 'success' : 'orange'} {...props} />
}
