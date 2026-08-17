/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { APPLICATION_STATUS } from '@/dto/enums/application'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import OnboardingFormTitle from '@/views/onbarding_sfi/pages/create-application.page/components/form-title'
import { OnboardStepButton } from '@/views/onbarding_sfi/pages/create-application.page/components/step-button'
import { useQueryState } from 'nuqs'

import IndoBankAccountFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/indonesian/bank-account'
import IndoIdentityVerificationFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/indonesian/identity-verification'
import IndoJobInfoFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/indonesian/job-info'
import IndoPersonalInformationFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/indonesian/personal-info'
import IndoTradingExperienceFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/indonesian/trading-experience'

import NonIndoBankAccountFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/non-indonesian/bank-account'
import NonIndoIdentityVerificationFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/non-indonesian/identity-verification'
import NonIndoJobInfoFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/non-indonesian/job-info'
import NonIndoPersonalInformationFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/non-indonesian/personal-info'
import NonIndoTradingExperienceFormStep from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/sub-steps/non-indonesian/trading-experience'
import { useEffect, useMemo } from 'react'

const INDONESIAN_SUB_STEPS = [
	{
		label: 'Identity Verification',
		content: <IndoIdentityVerificationFormStep />,
		value: 'identity_verification',
	},
	{
		label: 'Personal Information',
		content: <IndoPersonalInformationFormStep />,
		value: 'personal_information',
	},
	{
		label: 'Job Information',
		content: <IndoJobInfoFormStep />,
		value: 'job_details',
	},
	{
		label: 'Trading Experience',
		content: <IndoTradingExperienceFormStep />,
		value: 'trading_experience',
	},
	{
		label: 'Bank Account',
		content: <IndoBankAccountFormStep />,
		value: 'bank_account',
	},
]

const NON_INDONESIAN_SUB_STEPS = [
	{
		label: 'Identity Verification',
		content: <NonIndoIdentityVerificationFormStep />,
		value: 'identity_verification',
	},
	{
		label: 'Personal Information',
		content: <NonIndoPersonalInformationFormStep />,
		value: 'personal_information',
	},
	{
		label: 'Job Information',
		content: <NonIndoJobInfoFormStep />,
		value: 'job_details',
	},
	{
		label: 'Trading Experience',
		content: <NonIndoTradingExperienceFormStep />,
		value: 'trading_experience',
	},
	{
		label: 'Bank Account',
		content: <NonIndoBankAccountFormStep />,
		value: 'bank_account',
	},
]

function IndividualCustomerParticularsStep() {
	const { currentIndiApp, applicationQuery } = useCustomerApplication()
	const isIndonesian = currentIndiApp?.content?.nationality === 'indonesian'

	const worksheet = applicationQuery?.data?.data?.worksheet

	const [subStepParam, setSubStepParam] = useQueryState('subStep', {
		defaultValue: 'identity_verification',
	})

	const latestSfiWorkflow = worksheet?.sfi_workflow?.[(worksheet?.sfi_workflow?.length || 0) - 1]

	const uniqueRevisionTypes = useMemo(() => {
		const isWarningHidden =
			currentIndiApp?.status === APPLICATION_STATUS.STATUS_APPROVE ||
			currentIndiApp?.status === APPLICATION_STATUS.STATUS_REJECT ||
			currentIndiApp?.status === APPLICATION_STATUS.STATUS_PENDING

		if (!latestSfiWorkflow?.revision_type || latestSfiWorkflow?.approve_status !== 2 || isWarningHidden) {
			return []
		}

		const revisionTypeRaw = latestSfiWorkflow?.revision_type as string

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
					.map((s: string) => s.trim())
					.filter(Boolean)
					.map(Number)
					.filter((n: number) => !isNaN(n))
			} catch {
				return []
			}
		}
		return []
	}, [latestSfiWorkflow, currentIndiApp?.status])

	const hasSubStepWarning = (value: string) => {
		const mapping: Record<string, number> = {
			identity_verification: 4,
			personal_information: 1,
			job_details: 2,
			trading_experience: 5,
			bank_account: 3,
		}
		const id = mapping[value]
		return id !== undefined && uniqueRevisionTypes.includes(id)
	}

	const stepList = useMemo(() => {
		const baseSteps = isIndonesian ? INDONESIAN_SUB_STEPS : NON_INDONESIAN_SUB_STEPS

		return baseSteps.map((step) => ({
			...step,
			warning: hasSubStepWarning(step.value),
		}))
	}, [isIndonesian, uniqueRevisionTypes])

	const handleStepClick = async (step: string) => {
		if (!currentIndiApp) return
		await setSubStepParam(step)
	}

	useEffect(() => {
		if (!subStepParam && currentIndiApp) {
			if (currentIndiApp.content?.nationality) {
				setSubStepParam(stepList[0].value)
			}
		}
	}, [subStepParam, currentIndiApp, setSubStepParam, stepList])

	const activeStep = useMemo(() => {
		return stepList.find((step) => step.value === subStepParam) || stepList[0]
	}, [subStepParam, stepList])

	const getStepDataKey = (stepValue: string) => {
		const mapping: Record<string, string> = {
			identity_verification: 'identify_verification',
			personal_information: 'personal_information',
			job_details: 'job_details',
			trading_experience: 'trading_experience',
			bank_account: 'bank_account',
		}
		return mapping[stepValue]
	}

	const isStepCompleted = (stepValue: string) => {
		const dataKey = getStepDataKey(stepValue)
		if (!dataKey || !currentIndiApp?.content?.customer_particular) {
			return false
		}
		return !!currentIndiApp.content.customer_particular[
			dataKey as keyof typeof currentIndiApp.content.customer_particular
		]
	}

	return (
		<div className="flex flex-col gap-3">
			<OnboardingFormTitle
				title="Customer Particulars"
				subtitle="If you are a local customer, please ensure you meet the following requirements."
			/>

			<div className="bg-mui-bg-paper flex flex-col gap-6 md:flex-row">
				<div className="no-scrollbar flex w-full flex-row gap-4 overflow-x-auto pb-2 md:w-70 md:flex-col md:overflow-x-visible md:pb-0">
					{stepList.map((step, index) => {
						const isPreviousCompleted = index === 0 || isStepCompleted(stepList[index - 1].value)

						return (
							<div key={step.value} className="min-w-50 md:min-w-0">
								<OnboardStepButton
									label={step.label}
									active={step.value === subStepParam}
									enable={isPreviousCompleted}
									warning={step.warning}
									onClick={() => handleStepClick(step.value)}
								/>
							</div>
						)
					})}
				</div>
				<div className="min-w-0 flex-1">{activeStep.content}</div>
			</div>
		</div>
	)
}

export default IndividualCustomerParticularsStep
