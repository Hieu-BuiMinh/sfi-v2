'use client'

import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress } from '@mui/material'
import { useQueryState } from 'nuqs'
import { FormProvider, useForm } from 'react-hook-form'
import {
	HOME_OWNERSHIP_OPTIONS,
	MARRIAGE_STATUS_OPTIONS,
	PersonalInformationFormData,
	personalInformationSchema,
	RELATIONSHIP_OPTIONS,
} from './form-validate/schema'
import PersonalInforFormSection from './personal-infor-form-section'
import { CITY_OPTIONS } from '@/constants/sfi/indo-city.const'

function IndoPersonalInformationFormStep() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const isReadOnly = false

	const [, setSubStep] = useQueryState('subStep')

	const methods = useForm<PersonalInformationFormData>({
		resolver: zodResolver(personalInformationSchema),
		defaultValues: {
			full_name: currentIndiApp?.content?.customer_particular?.personal_information?.full_name || '',
			place_birth: currentIndiApp?.content?.customer_particular?.personal_information?.place_birth || 'Indonesia',
			gender: currentIndiApp?.content?.customer_particular?.personal_information?.gender || 'male',
			birthday: currentIndiApp?.content?.customer_particular?.personal_information?.birthday || '',
			email: currentIndiApp?.content?.customer_particular?.personal_information?.email || '',
			phone: currentIndiApp?.content?.customer_particular?.personal_information?.phone || '',
			home_address: currentIndiApp?.content?.customer_particular?.personal_information?.home_address || '',
			home_address_postal_code:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_address_postal_code || '',
			home_address_regency_code:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_address_regency_code ||
				CITY_OPTIONS[0].value,
			marriage_status:
				currentIndiApp?.content?.customer_particular?.personal_information?.marriage_status ||
				MARRIAGE_STATUS_OPTIONS[0].value,
			home_ownership_status:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_ownership_status ||
				HOME_OWNERSHIP_OPTIONS[0].value,
			current_address: currentIndiApp?.content?.customer_particular?.personal_information?.current_address || '',
			current_address_postal_code:
				currentIndiApp?.content?.customer_particular?.personal_information?.current_address_postal_code || '',
			current_address_regency_code:
				currentIndiApp?.content?.customer_particular?.personal_information?.current_address_regency_code ||
				CITY_OPTIONS[0].value,
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
					<PersonalInforFormSection />

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

export default IndoPersonalInformationFormStep
