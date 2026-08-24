import { APPLICATION_STATUS } from '@/dto/enums/application'
import { useDevice } from '@/hooks/use-device'
import { useAdminApplication } from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'
import toastUtil from '@/utils/toast'
import { useAdminApplicationFlow } from '../application-flow-provider'

function ApplicationApproveButton() {
	const { isDesktop } = useDevice()
	const {
		setDecision,
		setShowOperationModal,
		isMutationPending,
		currentFlowType,
		isEtpValid,
		requestEtpValidation,
	} = useAdminApplicationFlow()
	const t = useTranslations('admin.applications.detail.approval.options')
	const etpT = useTranslations('admin.applications.detail.approval.etp')

	const { applicationQuery } = useAdminApplication()

	if (
		applicationQuery?.data?.data?.application?.status === APPLICATION_STATUS.STATUS_APPROVE ||
		applicationQuery?.data?.data?.application?.status === APPLICATION_STATUS.STATUS_REJECT ||
		applicationQuery?.data?.data?.application?.status === APPLICATION_STATUS.STATUS_NOT_STARTED
	) {
		return null
	}

	return (
		<div className="flex w-full gap-2 md:w-auto">
			<Button
				variant="contained"
				color="error"
				size="small"
				fullWidth={!isDesktop}
				disabled={isMutationPending}
				onClick={() => {
					setDecision('reject')
					setShowOperationModal(true)
				}}
			>
				{t('reject')}
			</Button>

			<Button
				variant="contained"
				fullWidth={!isDesktop}
				size="small"
				disabled={isMutationPending}
				onClick={() => {
					if (currentFlowType === 'RISK' && !isEtpValid) {
						requestEtpValidation()
						toastUtil.error(etpT('validation_error'))
						return
					}

					if (currentFlowType === 'RISK') {
						setDecision('approve')
					}
					setShowOperationModal(true)
				}}
			>
				{currentFlowType !== 'RISK' ? t('save') : t('approve')}
			</Button>
		</div>
	)
}

export default ApplicationApproveButton
