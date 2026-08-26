import SfiTextField from '@/components/inputs/sfi-textfield'
import SfiCommonModal from '@/components/modals/common-modal'
import { adminEkycService } from '@/services/admin/ekyc'
import toastUtil from '@/utils/toast'
import { Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export type PrivyOverrideAction = 'approve' | 'reject'

interface PrivyOverrideModalProps {
	action: PrivyOverrideAction
	applicationId: string
	open: boolean
	onClose: () => void
}

export default function PrivyOverrideModal({ action, applicationId, open, onClose }: PrivyOverrideModalProps) {
	const t = useTranslations('admin.applications.detail.privy_ekyc.override_modal')
	const tc = useTranslations('common.button_text')
	const queryClient = useQueryClient()
	const [note, setNote] = useState(t(`${action}.default_note`))
	const [showNoteError, setShowNoteError] = useState(false)
	const overrideMutation = useMutation({
		mutationKey: adminEkycService.overrideApplicationStatus.key(),
		mutationFn: adminEkycService.overrideApplicationStatus.post,
		onSuccess: async (response) => {
			await queryClient.invalidateQueries({
				queryKey: adminEkycService.getApplicationStatus.key({ applicationId }),
			})
			toastUtil.success(response.message)
			onClose()
		},
		onError: () => {
			toastUtil.error(t('submit_error'))
		},
	})

	const handleConfirm = () => {
		if (!note.trim()) {
			setShowNoteError(true)
			return
		}

		overrideMutation.mutate({
			applicationId,
			status: action === 'approve' ? 'verified' : 'rejected',
			reason: note.trim(),
		})
	}

	return (
		<SfiCommonModal
			open={open}
			onClose={onClose}
			title={t('title', { action: action.toUpperCase() })}
			maxWidth="sm"
			confirmBtn={{
				label: tc('confirm'),
				onClick: handleConfirm,
				loading: overrideMutation.isPending,
				color: action === 'approve' ? 'success' : 'error',
			}}
			cancelBtn={{ label: tc('cancel'), disabled: overrideMutation.isPending }}
		>
			<div className="flex flex-col gap-5">
				<Typography color="text.secondary">{t('description')}</Typography>
				<SfiTextField
					label={t('note_label')}
					value={note}
					onChange={(event) => {
						setNote(event.target.value)
						setShowNoteError(false)
					}}
					multiline
					rows={4}
					fullWidth
					error={showNoteError}
					helperText={showNoteError ? t('note_required') : undefined}
				/>
			</div>
		</SfiCommonModal>
	)
}
