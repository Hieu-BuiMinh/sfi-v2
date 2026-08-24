import React from 'react'
import { cn } from '@/utils/cn'

// ─── InfoItem ─────────────────────────────────────────────────────────────

interface InfoItemProps {
	label: string
	value?: string | number | null
	/** Span full width across all columns */
	colSpan?: boolean
	className?: string
	labelClassName?: string
	valueClassName?: string
}

export function InfoItem({ label, value, colSpan, className, labelClassName, valueClassName }: InfoItemProps) {
	return (
		<div className={cn(colSpan && 'col-span-1 md:col-span-2 xl:col-span-3', className)}>
			<div
				className={cn(
					'text-mui-text-secondary mb-1 text-xs font-medium tracking-wide uppercase',
					labelClassName
				)}
			>
				{label}
			</div>
			<div className={cn('text-mui-text-primary text-sm wrap-break-word whitespace-normal', valueClassName)}>
				{value !== undefined && value !== null && value !== '' ? value : '–'}
			</div>
		</div>
	)
}

// ─── InfoGrid ─────────────────────────────────────────────────────────────

interface InfoGridProps {
	children: React.ReactNode
	className?: string
}

export function InfoGrid({ children, className }: InfoGridProps) {
	return (
		<div className={cn('grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3', className)}>
			{children}
		</div>
	)
}

// ─── InfoSection ──────────────────────────────────────────────────────────

interface InfoSectionProps {
	title: string
	children: React.ReactNode
	className?: string
	titleClassName?: string
}

export function InfoSection({ title, children, className, titleClassName }: InfoSectionProps) {
	return (
		<section className={className}>
			<p className={cn('text-mui-text-primary mb-4 text-sm font-semibold', titleClassName)}>{title}</p>
			{children}
		</section>
	)
}
