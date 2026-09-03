'use client'

import { cn } from '@/utils/cn'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { Collapse } from '@mui/material'
import { ReactNode, useState } from 'react'

export interface SfiCollapseProps {
	title: ReactNode
	icon?: ReactNode
	children: ReactNode
	subtitle?: ReactNode
	badge?: ReactNode
	actions?: ReactNode
	variant?: 'outline' | 'fill' | 'none'
	defaultExpanded?: boolean
	className?: string
	contentClassName?: string
}

function SfiCollapse({
	title,
	icon,
	children,
	subtitle,
	badge,
	actions,
	variant = 'outline',
	defaultExpanded = false,
	className,
	contentClassName,
}: SfiCollapseProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded)

	return (
		<section
			className={cn(
				'overflow-hidden rounded-lg',
				variant === 'outline' && 'border-mui-divider bg-mui-bg-paper border',
				variant === 'fill' && 'bg-mui-action-hover',
				variant === 'none' && 'bg-transparent',
				className
			)}
		>
			<div className="hover:bg-mui-action-hover flex items-center gap-3 px-5 py-4 transition-colors">
				<button
					type="button"
					onClick={() => setIsExpanded((expanded) => !expanded)}
					aria-expanded={isExpanded}
					className="flex min-w-0 flex-1 items-center gap-3 text-left"
				>
					{icon && (
						<div className="bg-mui-primary/30 text-mui-primary flex size-8 shrink-0 items-center justify-center rounded-full">
							{icon}
						</div>
					)}
					<div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
						<div className="flex min-w-0 items-center gap-2">
							<span className="text-mui-primary min-w-0 truncate font-bold">{title}</span>
							{badge !== undefined && (
								<span className="bg-mui-action-hover text-mui-text-secondary shrink-0 rounded-full px-2 py-0.5 text-xs">
									{badge}
								</span>
							)}
						</div>
						{subtitle && <span className="text-mui-text-secondary truncate">{subtitle}</span>}
					</div>
				</button>
				{actions}
				<button
					type="button"
					onClick={() => setIsExpanded((expanded) => !expanded)}
					aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
					className="flex shrink-0"
				>
					<ExpandMoreRoundedIcon
						className={cn('text-mui-text-secondary transition-transform', isExpanded && 'rotate-180')}
					/>
				</button>
			</div>

			<Collapse in={isExpanded} timeout="auto" unmountOnExit>
				<div className={cn(variant === 'outline' && 'border-mui-divider border-t', 'p-5', contentClassName)}>
					{children}
				</div>
			</Collapse>
		</section>
	)
}

export default SfiCollapse
