'use client'

import SfiChipBase, { SfiChipBaseProps } from '@/components/chips/chip-base'
import { useTranslations } from 'next-intl'

export interface ApplicationTypeChipProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	type: string
}

export default function ApplicationTypeChip({ type, ...props }: ApplicationTypeChipProps) {
	const t = useTranslations('components.chip.application_type')
	const normalizedType = type.toLowerCase()
	const isIndividual = normalizedType.includes('individual')
	const isCorporate = normalizedType.includes('corporate')

	if (!isIndividual && !isCorporate) return null

	return (
		<SfiChipBase
			label={isIndividual ? t('individual') : t('corporate')}
			variant={isIndividual ? 'info' : 'purple'}
			{...props}
		/>
	)
}
