/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import { ESfiFlowStatus } from '@/services/admin/sfi/flow/sfi-flow-res.dto'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'
import { useAdminApplicationFlow } from '@/views/portal_sfi/admin/pages/applications.page/components/application-flow/application-flow-provider'
import { useAdminApplication } from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import SfiStepper from '@/components/stepers/base-steper'
import ApprovalDetails from '@/views/portal_sfi/admin/pages/applications.page/components/application-flow/approval-detail'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'

const etpSchema = z.object({
	atp_id_number: z.string().length(11, 'ETP ID must be exactly 11 characters'),
})

type TEtpForm = z.infer<typeof etpSchema>

function AdminFlowStep() {
	const {
		operationFlowQuery,
		riskFlowQuery,
		activeStep,
		currentFlowType,
		etpAccountNumber,
		setEtpAccountNumber,
		setIsEtpValid,
		etpValidationRequest,
		updateAtpIdMutation,
	} = useAdminApplicationFlow()
	const t = useTranslations('admin.applications.detail.approval.etp')

	const { applicationQuery } = useAdminApplication()
	const application = applicationQuery.data?.data?.application

	const {
		control,
		formState: { isValid, isDirty, errors },
		reset,
		trigger,
	} = useForm<TEtpForm>({
		resolver: zodResolver(etpSchema),
		defaultValues: {
			atp_id_number: application?.binding_accounts?.atp_id_number || '',
		},
		mode: 'onChange',
	})

	const formAtpId = useWatch({ control, name: 'atp_id_number' })

	useEffect(() => {
		setEtpAccountNumber(formAtpId || '')
	}, [formAtpId, setEtpAccountNumber])

	useEffect(() => {
		setIsEtpValid(isValid)
	}, [isValid, setIsEtpValid])

	useEffect(() => {
		if (etpValidationRequest) {
			trigger('atp_id_number')
		}
	}, [etpValidationRequest, trigger])

	useEffect(() => {
		if (application?.binding_accounts?.atp_id_number) {
			reset({ atp_id_number: application.binding_accounts.atp_id_number })
		}
	}, [application?.binding_accounts?.atp_id_number, reset])

	const opsStatus = operationFlowQuery.data?.data?.approve_status
	const riskStatus = riskFlowQuery.data?.data?.approve_status

	const getStepIcon = (status?: number) => {
		if (status === ESfiFlowStatus.APPROVE) {
			return undefined
		}
		if (status === ESfiFlowStatus.PROCESSING) {
			return (
				<div className="bg-mui-warning-alpha/30 flex size-7 items-center justify-center rounded-full">
					<AutorenewRoundedIcon color="warning" sx={{ fontSize: 24 }} />
				</div>
			)
		}
		if (status === ESfiFlowStatus.PENDING) {
			return <HourglassBottomRoundedIcon color="warning" sx={{ fontSize: 26 }} />
		}
		if (status === ESfiFlowStatus.REJECT) {
			return <CancelIcon color="error" sx={{ fontSize: 26 }} />
		}
		return undefined
	}

	const steps = [
		{ label: 'OPS', icon: getStepIcon(opsStatus) },
		{ label: 'Risk', icon: getStepIcon(riskStatus) },
	]

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="rounded-md border p-3">
				<div className="mx-auto w-full max-w-sm">
					<SfiStepper steps={steps} activeStep={activeStep} alternativeLabel />
				</div>

				<ApprovalDetails />
			</div>

			{(currentFlowType === 'RISK' || riskStatus === ESfiFlowStatus.APPROVE) && (
				<div className="rounded-md border p-3">
					<div className="flex flex-col gap-2">
						<p className="text-sm font-semibold">{t('title')}</p>
						<p className="text-token-muted-foreground text-xs italic">{t('description')}</p>
						<div className="flex h-15 items-center gap-2">
							<RfhSfiTextField
								control={control}
								name="atp_id_number"
								label={t('label')}
								size="large"
								placeholder={t('placeholder')}
								className="max-w-72"
								slotProps={{
									htmlInput: { maxLength: 11 },
									formHelperText: { sx: { display: 'none' } },
								}}
							/>
							{application?.binding_accounts?.atp_id_number && (
								<Button
									variant="contained"
									size="large"
									className="mt-1"
									onClick={() =>
										updateAtpIdMutation.mutate({
											application_id: application.id,
											atp_id_number: formAtpId,
										})
									}
									disabled={updateAtpIdMutation.isPending || !isValid || !isDirty}
								>
									{t('update')}
								</Button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default AdminFlowStep
