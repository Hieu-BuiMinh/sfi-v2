/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react'
import { TextField, Typography, FormGroup, Alert } from '@mui/material'
import { useTranslations } from 'next-intl'
import SfiCommonModal from '@/components/modals/common-modal'
import SfiCheckbox from '@/components/inputs/sfi-checkbox'

export const REVISION_CHANNELS = [
	{ id: 1, labelKey: 'personal_info' },
	{ id: 2, labelKey: 'job_info' },
	{ id: 3, labelKey: 'bank_account' },
	{ id: 4, labelKey: 'identity_verification' },
	{ id: 5, labelKey: 'tax_compliance' },
	{ id: 6, labelKey: 'regulation_document' },
]

interface RevisionRequestModalProps {
	open: boolean
	onClose: () => void
	onConfirm: (data: { revision_type: number[]; revision_message: string }) => void
	isLoading?: boolean
	flowTitle: string
}

function RevisionRequestModal({ open, onClose, onConfirm, isLoading, flowTitle }: RevisionRequestModalProps) {
	const t = useTranslations('admin.applications.detail.approval.modals.revision')
	const tc = useTranslations('common.button_text')
	const tr = useTranslations('admin.applications.detail.approval.revision_channels')
	const [selectedItems, setSelectedItems] = useState<number[]>([])
	const [comment, setComment] = useState('')

	useEffect(() => {
		if (open) {
			setSelectedItems([])
			setComment('')
		}
	}, [open])

	const handleToggle = (id: number) => {
		setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
	}

	const isValid = selectedItems.length > 0 && comment.trim().length > 0

	const handleConfirm = () => {
		onConfirm({
			revision_type: selectedItems,
			revision_message: comment,
		})
	}

	return (
		<SfiCommonModal
			open={open}
			onClose={onClose}
			title={t('title', { type: flowTitle })}
			confirmBtn={{
				label: t('confirm'),
				onClick: handleConfirm,
				loading: isLoading,
				disabled: !isValid,
				color: 'warning',
			}}
			cancelBtn={{
				label: tc('cancel'),
				onClick: onClose,
				disabled: isLoading,
			}}
			maxWidth="md"
		>
			<div className="flex flex-col gap-6">
				<Alert severity="warning">{t('alert')}</Alert>

				<div>
					<Typography variant="subtitle2" className="mb-2 font-semibold">
						{t('sections_title')}
					</Typography>
					<FormGroup>
						<div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
							{REVISION_CHANNELS.map((item) => (
								<SfiCheckbox
									key={item.id}
									checked={selectedItems.includes(item.id)}
									onChange={() => handleToggle(item.id)}
									label={tr(item.labelKey as any)}
									disabled={isLoading}
								/>
							))}
						</div>
					</FormGroup>
				</div>

				<div>
					<Typography variant="subtitle2" className="text-mui-text-primary mb-2 font-semibold">
						{t('instructions_label')}
					</Typography>
					<TextField
						fullWidth
						multiline
						rows={3}
						placeholder={t('instructions_placeholder')}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						disabled={isLoading}
					/>
				</div>
			</div>
		</SfiCommonModal>
	)
}

export default RevisionRequestModal
