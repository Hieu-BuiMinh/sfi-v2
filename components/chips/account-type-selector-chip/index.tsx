'use client'

import SfsChipBase from '@/components/chips/chip-base'
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
			{isContinue && <SfsChipBase variant="warning" label="Continue" />}
			{registered && <SfsChipBase variant="success" label="Registered" />}
			{isProcessing && <SfsChipBase variant="warning" label="Processing" />}
		</div>
	)
}
