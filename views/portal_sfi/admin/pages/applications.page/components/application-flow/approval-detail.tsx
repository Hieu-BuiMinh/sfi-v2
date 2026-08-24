'use client'

import React from 'react'
import { Skeleton } from '@mui/material'
import { d } from '@/utils/dayjs'
import { useTranslations } from 'next-intl'
import { useAdminApplicationFlow } from '@/views/portal_sfi/admin/pages/applications.page/components/application-flow/application-flow-provider'
import { useAdminApplication } from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import { APPLICATION_STATUS } from '@/dto/enums/application'
import SfiRadioGroup from '@/components/inputs/sfi-radio-group'

function ApprovalDetails() {
	const { operationFlowQuery, riskFlowQuery, currentFlowType, decision, setDecision } = useAdminApplicationFlow()
	const t = useTranslations('admin.applications.detail.approval')

	const { applicationQuery } = useAdminApplication()

	const opsFlow = operationFlowQuery.data?.data
	const riskFlow = riskFlowQuery.data?.data
	const isLoading = operationFlowQuery.isLoading || riskFlowQuery.isLoading

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton width="150px" height={24} />
				<Skeleton width="100%" height={80} />
			</div>
		)
	}

	const isApplicationReviewable =
		applicationQuery?.data?.data?.application?.status === APPLICATION_STATUS.STATUS_PENDING

	const handleDecisionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDecision(event.target.value as 'approve' | 'revision')
	}

	const flowDecisionOptions = [
		{ value: 'approve', label: t('options.approve') },
		{ value: 'revision', label: t('options.revision') },
	]

	return (
		<div className="flex flex-col gap-6 text-xs md:text-sm">
			<div className="flex flex-col gap-4">
				<p className="font-semibold">{t('title')}</p>
				<div className="grid grid-cols-2 gap-1 md:grid-cols-4">
					{/* Row 1: Date and Time */}
					<div className="text-token-muted-foreground col-span-2 flex items-center">{t('date_time')}:</div>
					<div className="col-span-2 flex min-h-8 flex-col justify-center">
						{opsFlow?.approve_status !== null && (
							<p>{d(opsFlow?.approve_date).format('YYYY-MM-DD HH:mm:ss')} (OPS)</p>
						)}
						{riskFlow?.approve_status !== null && (
							<p>{d(riskFlow?.approve_date).format('YYYY-MM-DD HH:mm:ss')} (Risk)</p>
						)}
						{isApplicationReviewable && (
							<span className="text-mui-warning-main animate-pulse text-xs italic">
								{t('action_required', { type: currentFlowType })}
							</span>
						)}
					</div>

					{/* Row 2: Approve by OPS */}
					<div className="text-token-muted-foreground col-span-2 flex items-center">
						{t('approve_by_ops')}:
					</div>
					<div className="col-span-2 flex min-h-10 items-center">
						{isApplicationReviewable && currentFlowType === 'OPS' ? (
							<SfiRadioGroup
								row
								value={decision}
								onChange={handleDecisionChange}
								options={flowDecisionOptions}
								className="gap-2"
							/>
						) : (
							<span className="font-medium">{opsFlow?.approver?.email || '_'}</span>
						)}
					</div>

					{/* Row 3: Approve by Risk Team */}
					<div className="text-token-muted-foreground col-span-2 flex items-center">
						{t('approve_by_risk')}:
					</div>
					<div className="col-span-2 flex min-h-10 items-center">
						<span className="font-medium">{riskFlow?.approver?.email || '_'}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ApprovalDetails
