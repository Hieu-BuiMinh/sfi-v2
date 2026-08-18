'use client'

import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress } from '@mui/material'
import { useQueryState } from 'nuqs'
import { FormProvider, useForm } from 'react-hook-form'
import { CITY_OPTIONS } from '@/constants/sfi/indo-city.const'
import {
	ANNUAL_INCOME_OPTIONS,
	COMPANY_LINE_OF_BUSINESS_OPTIONS,
	JobInformationFormData,
	jobInformationSchema,
	SOURCE_OF_FUNDS_OPTIONS,
	TYPE_OF_JOB_OPTIONS,
} from './form-validate/schema'
import JobInformationFormSection from './job-information-form-section'

function IndoJobInfoFormStep() {
	const { currentIndiApp, updateApplicationMutation, isApplicationProcessing } = useCustomerApplication()
	const isReadOnly = isApplicationProcessing
	const [, setSubStep] = useQueryState('subStep')
	const jobDetails = currentIndiApp?.content?.customer_particular?.job_details

	const methods = useForm<JobInformationFormData>({
		resolver: zodResolver(jobInformationSchema),
		defaultValues: {
			type_job: jobDetails?.type_job || TYPE_OF_JOB_OPTIONS[0].value,
			company_line_of_business: jobDetails?.company_line_of_business || COMPANY_LINE_OF_BUSINESS_OPTIONS[0].value,
			company_job_title: jobDetails?.company_job_title || '',
			company_name: jobDetails?.company_name || '',
			company_address: jobDetails?.company_address || '',
			company_village: jobDetails?.company_village || '',
			company_sub_district: jobDetails?.company_sub_district || '',
			company_city: jobDetails?.company_city || CITY_OPTIONS[0].value,
			company_province: jobDetails?.company_province || '',
			company_postal_code: jobDetails?.company_postal_code || '',
			company_country: jobDetails?.company_country || '',
			length_of_work: jobDetails?.length_of_work || undefined,
			annual_income: jobDetails?.annual_income || ANNUAL_INCOME_OPTIONS[0].value,
			source_of_fund: jobDetails?.source_of_fund || SOURCE_OF_FUNDS_OPTIONS[0].value,
			source_of_fund_other: jobDetails?.source_of_fund_other || '',
			source_of_fund_other_specify: jobDetails?.source_of_fund_other_specify || '',
		},
	})

	const onSubmit = (data: JobInformationFormData) => {
		if (!currentIndiApp) return

		updateApplicationMutation.mutate(
			{
				data: {
					...currentIndiApp,
					content: {
						...currentIndiApp.content,
						customer_particular: {
							...currentIndiApp.content?.customer_particular,
							job_details: data,
						},
					},
				},
			},
			{
				onSuccess: () => {
					setSubStep('trading_experience')
				},
			}
		)
	}

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
				<fieldset disabled={isReadOnly} className="flex flex-col gap-6">
					<JobInformationFormSection />
				</fieldset>

				<div className="mt-4 flex justify-end">
					<Button
						type={isApplicationProcessing ? 'button' : 'submit'}
						variant="contained"
						size="large"
						onClick={isApplicationProcessing ? () => setSubStep('trading_experience') : undefined}
						disabled={updateApplicationMutation.isPending}
					>
						{updateApplicationMutation.isPending ? (
							<CircularProgress size={24} color="inherit" />
						) : isApplicationProcessing ? (
							'Continue'
						) : (
							'Save & Continue'
						)}
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}

export default IndoJobInfoFormStep
