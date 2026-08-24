import SfiTextField from '@/components/inputs/sfi-textfield'
import SfiCommonModal from '@/components/modals/common-modal'
import { Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface RejectConfirmModalProps {
	open: boolean
	onClose: () => void
	onConfirm: (data: { reject_message: string }) => void
	isLoading?: boolean
	flowTitle: string
}

function RejectConfirmModal({ open, onClose, onConfirm, isLoading, flowTitle }: RejectConfirmModalProps) {
	const t = useTranslations('admin.applications.detail.approval.modals.reject')
	const tc = useTranslations('common.button_text')
	const [reason, setReason] = useState('')

	const handleConfirm = () => {
		onConfirm({
			reject_message: reason.trim() || 'Rejected by Admin',
		})
	}

	const isInvalid = !reason.trim()

	return (
		<SfiCommonModal
			open={open}
			onClose={onClose}
			title={t('title', { type: flowTitle })}
			confirmBtn={{
				label: t('confirm'),
				onClick: handleConfirm,
				loading: isLoading,
				color: 'error',
				disabled: isInvalid,
			}}
			cancelBtn={{
				label: tc('cancel'),
				onClick: onClose,
				disabled: isLoading,
			}}
			maxWidth="xs"
		>
			<div className="flex flex-col gap-4">
				<Typography variant="body2" color="text.secondary">
					{t('message', { type: flowTitle })}
				</Typography>
				<SfiTextField
					label={t('reason_label')}
					placeholder={t('reason_placeholder')}
					multiline
					rows={3}
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					fullWidth
					required
					autoFocus
				/>
			</div>
		</SfiCommonModal>
	)
}

export default RejectConfirmModal
