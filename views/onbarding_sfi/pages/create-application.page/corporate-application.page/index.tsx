'use client'

import SfiCommonModal from '@/components/modals/common-modal'
import { APPLICATION_STATUS } from '@/dto/enums/application'
import { getAppConfig } from '@/utils/get-app-config'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import CorporateApplicationFormSection from './corporate-application-form-section'
import { CorporateApplicationFormData, corporateApplicationSchema } from './form-validate/schema'

const getDefaultValues = (
	corporateInformation?: Partial<CorporateApplicationFormData>
): CorporateApplicationFormData => ({
	company_name: corporateInformation?.company_name || '',
	country_of_incorporation: corporateInformation?.country_of_incorporation || '',
	business_registration_number: corporateInformation?.business_registration_number || '',
	nature_of_business: corporateInformation?.nature_of_business || '',
	business_address: corporateInformation?.business_address || '',
	estimated_annual_revenue: corporateInformation?.estimated_annual_revenue || '',
	contact_full_name: corporateInformation?.contact_full_name || '',
	contact_position: corporateInformation?.contact_position || '',
	contact_email: corporateInformation?.contact_email || '',
	contact_phone: corporateInformation?.contact_phone || '',
	preferred_contact_method: corporateInformation?.preferred_contact_method || '',
})

function CorporateApplicationPageView() {
	const config = getAppConfig()
	const router = useRouter()
	const { currentCorpApp, updateApplicationMutation } = useCustomerApplication()
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const corporateInformation = currentCorpApp?.content?.corporate_information

	const methods = useForm<CorporateApplicationFormData>({
		resolver: zodResolver(corporateApplicationSchema),
		defaultValues: getDefaultValues(corporateInformation),
	})
	const { reset } = methods

	useEffect(() => {
		if (corporateInformation) reset(getDefaultValues(corporateInformation))
	}, [corporateInformation, reset])

	const onSubmit = (data: CorporateApplicationFormData) => {
		if (!currentCorpApp) return

		updateApplicationMutation.mutate(
			{
				data: {
					...currentCorpApp,
					status: APPLICATION_STATUS.STATUS_PENDING,
					content: {
						...currentCorpApp.content,
						corporate_information: data,
					},
				},
			},
			{ onSuccess: () => setShowSuccessModal(true) }
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="border-mui-divider bg-mui-bg-paper flex flex-col gap-2 rounded-lg border p-8 shadow-sm">
				<Typography variant="h6" className="font-bold">
					Corporate Account Request
				</Typography>
				<p className="text-mui-text-secondary text-sm">
					Register your interest and we will contact you to guide you through the corporate account opening
					process.
				</p>
			</div>

			<div className="border-mui-divider bg-mui-bg-paper rounded-lg border p-8">
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
						<CorporateApplicationFormSection />

						<div className="flex justify-between">
							<Button variant="outlined" type="button" onClick={() => router.push('/register')}>
								Back
							</Button>
							<Button type="submit" variant="contained" disabled={updateApplicationMutation.isPending}>
								{updateApplicationMutation.isPending ? (
									<CircularProgress size={24} color="inherit" />
								) : (
									'Next'
								)}
							</Button>
						</div>
					</form>
				</FormProvider>
			</div>

			<SfiCommonModal
				open={showSuccessModal}
				onClose={() => {}}
				title="Application Submitted Successfully"
				hideCloseButton
				confirmBtn={{
					label: 'Confirm',
					onClick: () => {
						const tradingUrl = config.pages?.trading_page || config.trading_page
						if (tradingUrl) window.location.assign(tradingUrl)
					},
				}}
			>
				<Typography>
					Your corporate account request has been submitted. We will contact you to guide you through the
					account opening process.
				</Typography>
			</SfiCommonModal>
		</div>
	)
}

export default CorporateApplicationPageView
