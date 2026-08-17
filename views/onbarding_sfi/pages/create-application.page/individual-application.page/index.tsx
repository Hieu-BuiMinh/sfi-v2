/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import SfiCommonModal from '@/components/modals/common-modal'
import { APPLICATION_STATUS } from '@/dto/enums/application'
import { getAppConfig } from '@/utils/get-app-config'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import IndividualOnboardingFormLayout from '@/views/onbarding_sfi/pages/create-application.page/components/sections/individual-form-layout'
import { Button, CircularProgress, Typography } from '@mui/material'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useMemo, useState } from 'react'

import SfiStepper from '@/components/stepers/base-steper'
import IndividualCustomerParticularsStep from './steps/customer-particulars-forms'
import IndividualRegulationDocumentStep from './steps/regulation-document-form'
import IndividualTaxComplianceStep from './steps/tax-compliance-declaration'

const INDIVIDUAL_INDONESIAN_STEPS = [
	{
		label: 'Customer Particulars',
		description: 'Basic details and contact',
		content: <IndividualCustomerParticularsStep />,
	},
	{
		label: 'Regulation document',
		description: 'Settlement details',
		content: <IndividualRegulationDocumentStep />,
	},
]

const INDIVIDUAL_NON_INDONESIAN_STEPS = [
	{
		label: 'Customer Particulars',
		description: 'Basic details and contact',
		content: <IndividualCustomerParticularsStep />,
	},
	{
		label: 'Tax Compliance Declaration',
		description: 'ID card and portrait',
		content: <IndividualTaxComplianceStep />,
	},
	{
		label: 'Regulation document',
		description: 'Settlement details',
		content: <IndividualRegulationDocumentStep />,
	},
]

function IndividualApplicationPageView() {
	const appConfig = getAppConfig()
	const { currentIndiApp, updateApplicationMutation, applicationQuery } = useCustomerApplication()

	const worksheet = applicationQuery?.data?.data?.worksheet

	const [activeStep, setActiveStep] = useQueryState('step', parseAsInteger.withDefault(0))
	const [showSuccessModal, setShowSuccessModal] = useState(false)

	const isIndonesian = currentIndiApp?.content?.nationality === 'indonesian'

	const latestSfiWorkflow = worksheet?.sfi_workflow?.[(worksheet?.sfi_workflow?.length || 0) - 1]

	const uniqueRevisionTypes = useMemo(() => {
		const isWarningHidden =
			currentIndiApp?.status === APPLICATION_STATUS.STATUS_APPROVE ||
			currentIndiApp?.status === APPLICATION_STATUS.STATUS_REJECT ||
			currentIndiApp?.status === APPLICATION_STATUS.STATUS_PENDING

		if (!latestSfiWorkflow?.revision_type || latestSfiWorkflow?.approve_status !== 2 || isWarningHidden) {
			return []
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const revisionTypeRaw = latestSfiWorkflow.revision_type as any

		if (Array.isArray(revisionTypeRaw)) {
			if (revisionTypeRaw.length === 0) return []
			const lastRevision = revisionTypeRaw[revisionTypeRaw.length - 1]
			return Array.isArray(lastRevision.type) ? lastRevision.type.map(Number) : []
		}

		if (typeof revisionTypeRaw === 'string') {
			try {
				if (revisionTypeRaw.startsWith('[')) {
					return JSON.parse(revisionTypeRaw).map(Number)
				}
				return revisionTypeRaw
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
					.map(Number)
					.filter((n) => !isNaN(n))
			} catch {
				return []
			}
		}
		return []
	}, [latestSfiWorkflow, currentIndiApp?.status])

	const hasStepWarning = (label: string) => {
		const mapping: Record<string, number[]> = {
			'Customer Particulars': [1, 2, 3, 4, 5],
			'Tax Compliance Declaration': [5],
			'Regulation document': [6],
		}
		const ids = mapping[label] || []
		return ids.some((id) => uniqueRevisionTypes.includes(id))
	}

	const stepList = useMemo(() => {
		const baseSteps = isIndonesian ? INDIVIDUAL_INDONESIAN_STEPS : INDIVIDUAL_NON_INDONESIAN_STEPS

		return baseSteps.map((step) => ({
			...step,
			warning: hasStepWarning(step.label),
		}))
	}, [isIndonesian, uniqueRevisionTypes])

	function checkStepCompleted(index: number): boolean {
		if (!currentIndiApp?.content) return false

		const stepLabel = stepList[index]?.label

		if (stepLabel === 'Customer Particulars') {
			const customer_particular = currentIndiApp.content.customer_particular
			return (
				!!customer_particular?.personal_information &&
				!!customer_particular?.job_details &&
				!!customer_particular?.trading_experience &&
				!!customer_particular?.bank_account &&
				!!customer_particular?.identify_verification
			)
		}

		if (stepLabel === 'Tax Compliance Declaration') {
			return !!currentIndiApp.content.tax_compliance_declaration
		}

		if (stepLabel === 'Regulation document') {
			return !!currentIndiApp.content.confirm_document
		}

		return false
	}

	const handleStepClick = (index: number) => {
		const canClick = Array.from({ length: index }).every((_, i) => checkStepCompleted(i))

		if (index <= activeStep || canClick) {
			setActiveStep(index)
		}
	}

	const handleNext = async () => {
		if (checkStepCompleted(activeStep)) {
			await setActiveStep(Math.min(stepList.length - 1, activeStep + 1))
		}
	}

	const handleFinish = () => {
		if (currentIndiApp) {
			updateApplicationMutation.mutate(
				{
					data: {
						...currentIndiApp,
						status: APPLICATION_STATUS.STATUS_PENDING,
					},
				},
				{
					onSuccess: () => {
						setShowSuccessModal(true)
					},
				}
			)
		}
	}

	const isLastStep = activeStep === stepList.length - 1

	return (
		<IndividualOnboardingFormLayout>
			<div className="border-mui-divider bg-mui-bg-paper flex flex-col gap-4 rounded-lg border p-10">
				<SfiStepper steps={stepList} activeStep={activeStep} onStepClick={handleStepClick} alternativeLabel />

				{stepList?.[activeStep]?.content}

				<div className="mt-4 flex justify-between">
					<Button
						variant="outlined"
						onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
						disabled={activeStep === 0}
					>
						Back
					</Button>

					{!isLastStep ? (
						<Button variant="contained" onClick={handleNext} disabled={!checkStepCompleted(activeStep)}>
							Next
						</Button>
					) : (
						<Button
							variant="contained"
							onClick={handleFinish}
							disabled={
								!currentIndiApp?.content?.confirm_document?.confirm_understand ||
								updateApplicationMutation.isPending
							}
						>
							{updateApplicationMutation.isPending ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								'Submit and Complete'
							)}
						</Button>
					)}
				</div>

				<SfiCommonModal
					open={showSuccessModal}
					onClose={() => {}}
					title="Application Submitted Successfully"
					hideCloseButton
					confirmBtn={{
						label: 'Confirm',
						onClick: () => {
							const tradingUrl = appConfig.pages?.trading_page || appConfig.trading_page
							if (tradingUrl) window.location.assign(tradingUrl)
						},
					}}
				>
					<Typography>
						Congratulations! We have received your submission, and we will be in touch really soon.
					</Typography>
				</SfiCommonModal>
			</div>
		</IndividualOnboardingFormLayout>
	)
}

export default IndividualApplicationPageView
