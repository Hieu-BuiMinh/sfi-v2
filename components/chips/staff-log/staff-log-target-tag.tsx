'use client'

import SfiChipBase, { SfiChipBaseProps } from '@/components/chips/chip-base'

interface StaffLogTargetTagProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	target: string
}

export const StaffLogTargetTag = ({ target, className, ...props }: StaffLogTargetTagProps) => {
	return <SfiChipBase label={target} variant="secondary" className={className} {...props} />
}

export default StaffLogTargetTag
