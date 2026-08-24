'use client'

import SfiChipBase, { SfiChipBaseProps, SfiChipBaseVariant } from '@/components/chips/chip-base'
import { useTranslations } from 'next-intl'

interface StaffLogEventChipProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	event: string
}

const EVENT_STATUS_VARIANTS: Record<string, SfiChipBaseVariant> = {
	created: 'success',
	updated: 'info',
	deleted: 'error',
}

export const StaffLogEventChip = ({ event, ...props }: StaffLogEventChipProps) => {
	const t = useTranslations('components.chip.staff_log_event')
	const labels: Record<string, string> = {
		created: t('created'),
		updated: t('updated'),
		deleted: t('deleted'),
	}

	return (
		<SfiChipBase label={labels[event] || event} variant={EVENT_STATUS_VARIANTS[event] || 'secondary'} {...props} />
	)
}

export default StaffLogEventChip
