'use client'

import SfiChipBase from '@/components/chips/chip-base'
import React from 'react'

export interface AccountTypeSelectorChipProps {
	isContinue?: boolean
	registered?: boolean
	isProcessing?: boolean
	className?: string
}

export default function AccountTypeSelectorChip({
	isContinue = false,
	registered = false,
	isProcessing = false,
	className,
}: AccountTypeSelectorChipProps) {
	return (
		<div className={`flex items-center gap-2 ${className || ''}`}>
			{isContinue && <SfiChipBase variant="warning" label="Continue" />}
			{registered && <SfiChipBase variant="success" label="Registered" />}
			{isProcessing && <SfiChipBase variant="warning" label="Processing" />}
		</div>
	)
}
