'use client'

import SfiChipBase, { SfiChipBaseProps, SfiChipBaseVariant } from '@/components/chips/chip-base'
import { useTranslations } from 'next-intl'

export enum STAFF_STATUS {
	ACTIVE = 1,
	INACTIVE = 0,
}

export const STAFF_STATUS_COLOR: Record<STAFF_STATUS, SfiChipBaseVariant> = {
	[STAFF_STATUS.ACTIVE]: 'success',
	[STAFF_STATUS.INACTIVE]: 'secondary',
}

export type SfiStaffStatusChipProps = Omit<SfiChipBaseProps, 'label' | 'variant'> & {
	status: STAFF_STATUS | number
}

export default function SfiStaffStatusChip({ status, ...props }: SfiStaffStatusChipProps) {
	const t = useTranslations('components.chip.staff_status')
	const currentStatus = status as STAFF_STATUS
	const labels: Record<STAFF_STATUS, string> = {
		[STAFF_STATUS.ACTIVE]: t('active'),
		[STAFF_STATUS.INACTIVE]: t('inactive'),
	}

	return (
		<SfiChipBase
			label={labels[currentStatus] || t('inactive')}
			variant={STAFF_STATUS_COLOR[currentStatus] || 'secondary'}
			{...props}
		/>
	)
}
