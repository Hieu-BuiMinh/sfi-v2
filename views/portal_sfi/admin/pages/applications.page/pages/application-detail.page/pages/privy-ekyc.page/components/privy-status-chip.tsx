import SfiChipBase, { SfiChipBaseVariant } from '@/components/chips/chip-base'

interface PrivyStatusChipProps {
	status: string
}

export default function PrivyStatusChip({ status }: PrivyStatusChipProps) {
	const normalizedStatus = status.toLowerCase()
	let variant: SfiChipBaseVariant = 'secondary'

	if (['approved', 'verified', 'success', 'passed'].includes(normalizedStatus)) variant = 'success'
	if (['pending', 'processing', 'in_progress'].includes(normalizedStatus)) variant = 'warning'
	if (['rejected', 'failed', 'error'].includes(normalizedStatus)) variant = 'error'

	return <SfiChipBase label={status.replaceAll('_', ' ')} variant={variant} className="h-6 px-2.5 text-xs" />
}
