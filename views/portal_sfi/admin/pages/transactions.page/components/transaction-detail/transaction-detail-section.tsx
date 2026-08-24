import React from 'react'
import { cn } from '@/utils/cn'

interface TransactionDetailSectionProps {
	title: string
	children: React.ReactNode
	className?: string
}

export default function TransactionDetailSection({ title, children, className }: TransactionDetailSectionProps) {
	return (
		<div className={cn('flex max-w-full min-w-0 flex-col gap-4 overflow-hidden', className)}>
			<h3 className="text-mui-text-primary shrink-0 text-sm font-semibold tracking-wider capitalize">{title}</h3>
			<div className="bg-mui-white dark:bg-mui-bg-paper border-mui-divider min-w-0 overflow-hidden rounded-lg border p-6 shadow-sm">
				{children}
			</div>
		</div>
	)
}
