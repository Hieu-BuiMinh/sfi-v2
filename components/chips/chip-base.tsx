'use client'

import React from 'react'
import { cn } from '@/utils/cn'

export type SfiChipBaseVariant = 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'purple' | 'orange'

export interface SfiChipBaseProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: SfiChipBaseVariant
	label?: React.ReactNode
}

const VARIANT_STYLES: Record<SfiChipBaseVariant, string> = {
	success:
		'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/50',
	warning:
		'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/50',
	error: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900/50',
	info: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-900/50',
	secondary:
		'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-900/50',
	purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/50',
	orange: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-900/50',
}

export default function SfiChipBase({ variant = 'secondary', className, label, children, ...props }: SfiChipBaseProps) {
	return (
		<div
			className={cn(
				'inline-flex h-5 max-w-full items-center truncate rounded border px-2 text-[10px] font-medium tracking-wider capitalize transition-colors',
				VARIANT_STYLES[variant],
				className
			)}
			{...props}
		>
			<span className="w-full truncate">{label || children}</span>
		</div>
	)
}
