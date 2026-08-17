import AccountTypeSelectorChip from '@/components/chips/account-type-selector-chip'
import { cn } from '@/utils/cn'
import React from 'react'

function RegisterAccountTypeSelector({
	onClick,
	active = false,
	icon,
	title,
	description,
	registered = false,
	isContinue = false,
	isProcessing = false,
}: {
	onClick?: () => void
	active?: boolean
	icon: React.ReactNode
	title: string
	description: string
	registered?: boolean
	isContinue?: boolean
	isProcessing?: boolean
}) {
	return (
		<div
			className={cn(
				'bg-mui-bg-paper border-mui-divider flex cursor-pointer items-center gap-5 rounded-xl border-2 p-7 opacity-60 transition-all duration-200 ease-in-out hover:opacity-100',
				active && 'border-mui-primary opacity-100'
			)}
			onClick={onClick}
		>
			<div
				className={cn(
					'text-mui-text-secondary flex items-center justify-center transition-colors duration-200',
					active && 'text-mui-primary'
				)}
			>
				{icon}
			</div>
			<div className="flex w-full max-w-125 flex-col gap-3 text-sm">
				<div className="flex w-full items-center justify-between">
					<p className={cn('font-bold transition-colors duration-200', active && 'text-mui-primary')}>
						{title}
					</p>
					<AccountTypeSelectorChip
						registered={registered}
						isContinue={isContinue}
						isProcessing={isProcessing}
					/>
				</div>
				<p className="text-mui-text-secondary">{description}</p>
			</div>
		</div>
	)
}

export default RegisterAccountTypeSelector
