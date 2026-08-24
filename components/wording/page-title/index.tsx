'use client'

import { cn } from '@/utils/cn'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { IconButton } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'

export interface SfiPageTitleProps {
	title: string | ReactNode
	subtitle?: string | ReactNode
	className?: string
	showBackButton?: boolean
}

export const SfiPageTitle = ({ title, subtitle, className = '', showBackButton = false }: SfiPageTitleProps) => {
	const router = useRouter()

	return (
		<div className={cn('flex items-start gap-3', className)}>
			{showBackButton && (
				<IconButton
					onClick={() => router.back()}
					aria-label="Back"
					className="border-mui-divider shrink-0 border"
				>
					<ArrowBackRoundedIcon />
				</IconButton>
			)}
			<div className="flex min-w-0 flex-1 flex-col">
				<h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">{title}</h1>
				{subtitle && (
					<p className="text-sx font-medium text-gray-500 md:text-sm dark:text-gray-400">{subtitle}</p>
				)}
			</div>
		</div>
	)
}

export default SfiPageTitle
