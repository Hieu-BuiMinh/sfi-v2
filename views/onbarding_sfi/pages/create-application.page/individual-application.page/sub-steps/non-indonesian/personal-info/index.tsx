'use client'

import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress } from '@mui/material'
import { useQueryState } from 'nuqs'
import { FormProvider, useForm } from 'react-hook-form'
import { PersonalInformationFormData, personalInformationSchema, RELATIONSHIP_OPTIONS } from './form-validate/schema'
import NonIndoPersonalInformationFormSection from './non-indo-personal-information-form-section'

function NonIndoPersonalInformationFormStep() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const isReadOnly = false

	const [, setSubStep] = useQueryState('subStep')

	const methods = useForm<PersonalInformationFormData>({
		resolver: zodResolver(personalInformationSchema),
		defaultValues: {
			ktp_or_passport: currentIndiApp?.content?.customer_particular?.personal_information?.ktp_or_passport || '',
			selectedCountry: currentIndiApp?.content?.customer_particular?.personal_information?.selectedCountry || '',
			full_name: currentIndiApp?.content?.customer_particular?.personal_information?.full_name || '',
			place_birth: currentIndiApp?.content?.customer_particular?.personal_information?.place_birth || '',
			gender: currentIndiApp?.content?.customer_particular?.personal_information?.gender || 'male',
			birthday: currentIndiApp?.content?.customer_particular?.personal_information?.birthday || '',
			email: currentIndiApp?.content?.customer_particular?.personal_information?.email || '',
			phone: currentIndiApp?.content?.customer_particular?.personal_information?.phone || '',
			id_address: currentIndiApp?.content?.customer_particular?.personal_information?.id_address || '',
			village: currentIndiApp?.content?.customer_particular?.personal_information?.village || '',
			sub_district: currentIndiApp?.content?.customer_particular?.personal_information?.sub_district || '',
			city: currentIndiApp?.content?.customer_particular?.personal_information?.city || '',
			province: currentIndiApp?.content?.customer_particular?.personal_information?.province || '',
			postal_code: currentIndiApp?.content?.customer_particular?.personal_information?.postal_code || '',
			country: currentIndiApp?.content?.customer_particular?.personal_information?.country || '',
			emergency_contact_name:
				currentIndiApp?.content?.customer_particular?.personal_information?.emergency_contact_name || '',
			emergency_phone: currentIndiApp?.content?.customer_particular?.personal_information?.emergency_phone || '',
			relationship_with_customer:
				currentIndiApp?.content?.customer_particular?.personal_information?.relationship_with_customer ||
				RELATIONSHIP_OPTIONS[0].value,
			relationship_with_customer_other:
				currentIndiApp?.content?.customer_particular?.personal_information?.relationship_with_customer_other ||
				'',
			mother_maiden_name:
				currentIndiApp?.content?.customer_particular?.personal_information?.mother_maiden_name || '',
			referral_code: currentIndiApp?.content?.customer_particular?.personal_information?.referral_code || '',
		},
	})

	const onSubmit = (data: PersonalInformationFormData) => {
		if (currentIndiApp) {
			updateApplicationMutation.mutate(
				{
					data: {
						...currentIndiApp,
						content: {
							...currentIndiApp.content,
							customer_particular: {
								...currentIndiApp.content?.customer_particular,
								personal_information: data,
							},
						},
					},
				},
				{
					onSuccess: () => {
						setSubStep('job_details')
					},
				}
			)
		}
	}

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
				<fieldset disabled={isReadOnly} className="flex flex-col gap-6">
					<NonIndoPersonalInformationFormSection />

					<div className="mt-4 flex justify-end">
						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={updateApplicationMutation.isPending || isReadOnly}
						>
							{updateApplicationMutation.isPending ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								'Save & Continue'
							)}
						</Button>
					</div>
				</fieldset>
			</form>
		</FormProvider>
	)
}

export default NonIndoPersonalInformationFormStep
