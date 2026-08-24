import { Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useAdminApplicationFlow } from '../application-flow-provider'
import SfiCommonModal from '@/components/modals/common-modal'

interface ApprovalConfirmModalProps {
	open: boolean
	onClose: () => void
	onConfirm: (data: { revision_type: number[]; revision_message: string }) => void
	isLoading?: boolean
	flowTitle: string
}

function ApprovalConfirmModal({ open, onClose, onConfirm, isLoading, flowTitle }: ApprovalConfirmModalProps) {
	const t = useTranslations('admin.applications.detail.approval.modals.approval')
	const { isEtpValid } = useAdminApplicationFlow()

	const handleConfirm = () => {
		onConfirm({
			revision_type: [],
			revision_message: 'Approved',
		})
	}

	const isRiskStep = flowTitle === 'RISK'
	const isInvalid = isRiskStep && !isEtpValid

	return (
		<SfiCommonModal
			open={open}
			onClose={onClose}
			title={t('title', { type: flowTitle })}
			confirmBtn={{
				label: t('confirm'),
				onClick: handleConfirm,
				loading: isLoading,
				color: 'primary',
				disabled: isInvalid,
			}}
			cancelBtn={{
				label: useTranslations('common.button_text')('cancel'),
				onClick: onClose,
				disabled: isLoading,
			}}
			maxWidth="xs"
		>
			<div className="flex flex-col gap-4">
				<Typography variant="body2" color="text.secondary">
					Upon approval, the customer&apos;s trading account will be activated, allowing them to begin
					trading. Please confirm that all information is correct before proceeding
				</Typography>
			</div>
		</SfiCommonModal>
	)
}

export default ApprovalConfirmModal
