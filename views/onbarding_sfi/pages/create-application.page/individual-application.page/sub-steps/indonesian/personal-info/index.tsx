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
import { useEffect, useRef } from 'react'

function IndoPersonalInformationFormStep() {
	const { currentIndiApp, updateApplicationMutation, isApplicationProcessing } = useCustomerApplication()
	const isReadOnly = isApplicationProcessing
	const personalInformation = currentIndiApp?.content?.customer_particular?.personal_information
	const marriageStatusMap: Record<string, string> = {
		Single: 'single',
		Married: 'married',
		Widowed: 'widower',
	}
	const homeOwnershipStatusMap: Record<string, string> = {
		Rented: 'Rent',
		'Family House': 'Family',
	}
	const relationshipMap: Record<string, string> = {
		Parent: 'parent',
		Spouse: 'spouse',
		Child: 'child',
		Sibling: 'sibling',
		Other: 'other',
	}

	const [, setSubStep] = useQueryState('subStep')

	const methods = useForm<PersonalInformationFormData>({
		resolver: zodResolver(personalInformationSchema),
		defaultValues: {
			ktp_or_passport:
				currentIndiApp?.content?.customer_particular?.personal_information?.ktp_or_passport ||
				currentIndiApp?.content?.customer_particular?.identify_verification?.ktp_or_passport ||
				'',
			npwp_number:
				currentIndiApp?.content?.customer_particular?.personal_information?.npwp_number ||
				currentIndiApp?.content?.customer_particular?.identify_verification?.npwp_number ||
				'',
			full_name: currentIndiApp?.content?.customer_particular?.personal_information?.full_name || '',
			place_birth: currentIndiApp?.content?.customer_particular?.personal_information?.place_birth || 'Indonesia',
			gender: currentIndiApp?.content?.customer_particular?.personal_information?.gender || 'male',
			birthday: currentIndiApp?.content?.customer_particular?.personal_information?.birthday || '',
			email: currentIndiApp?.content?.customer_particular?.personal_information?.email || '',
			phone: currentIndiApp?.content?.customer_particular?.personal_information?.phone || '',
			home_address: currentIndiApp?.content?.customer_particular?.personal_information?.home_address || '',
			home_address_village:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_address_village || '',
			home_address_sub_district:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_address_sub_district || '',
			home_address_postal_code:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_address_postal_code || '',
			home_address_regency_code:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_address_regency_code ||
				CITY_OPTIONS[0].value,
			home_address_province:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_address_province || '',
			home_address_country:
				currentIndiApp?.content?.customer_particular?.personal_information?.home_address_country || 'Indonesia',
			marriage_status:
				marriageStatusMap[personalInformation?.marriage_status] ||
				personalInformation?.marriage_status ||
				MARRIAGE_STATUS_OPTIONS[0].value,
			home_ownership_status:
				homeOwnershipStatusMap[personalInformation?.home_ownership_status] ||
				personalInformation?.home_ownership_status ||
				HOME_OWNERSHIP_OPTIONS[0].value,
			current_address: currentIndiApp?.content?.customer_particular?.personal_information?.current_address || '',
			current_address_village:
				currentIndiApp?.content?.customer_particular?.personal_information?.current_address_village || '',
			current_address_sub_district:
				currentIndiApp?.content?.customer_particular?.personal_information?.current_address_sub_district || '',
			current_address_postal_code:
				currentIndiApp?.content?.customer_particular?.personal_information?.current_address_postal_code || '',
			current_address_regency_code:
				currentIndiApp?.content?.customer_particular?.personal_information?.current_address_regency_code ||
				CITY_OPTIONS[0].value,
			current_address_province:
				currentIndiApp?.content?.customer_particular?.personal_information?.current_address_province || '',
			current_address_country:
				currentIndiApp?.content?.customer_particular?.personal_information?.current_address_country ||
				'Indonesia',
			is_address_same:
				currentIndiApp?.content?.customer_particular?.personal_information?.is_address_same ??
				currentIndiApp?.content?.customer_particular?.personal_information?.is_registered_address_same ??
				false,
			emergency_contact_name:
				currentIndiApp?.content?.customer_particular?.personal_information?.emergency_contact_name || '',
			emergency_phone: currentIndiApp?.content?.customer_particular?.personal_information?.emergency_phone || '',
			relationship_with_customer:
				relationshipMap[personalInformation?.relationship_with_customer] ||
				personalInformation?.relationship_with_customer ||
				RELATIONSHIP_OPTIONS[0].value,
			relationship_with_customer_other:
				currentIndiApp?.content?.customer_particular?.personal_information?.relationship_with_customer_other ||
				'',
			mother_maiden_name:
				currentIndiApp?.content?.customer_particular?.personal_information?.mother_maiden_name || '',
			referral_code: currentIndiApp?.content?.customer_particular?.personal_information?.referral_code || '',
		},
	})
	const hydratedAddressApplicationIdRef = useRef<string | null>(null)

	useEffect(() => {
		if (!currentIndiApp || !personalInformation || hydratedAddressApplicationIdRef.current === currentIndiApp.id) {
			return
		}

		const registeredAddressValues = [
			personalInformation.home_address,
			personalInformation.home_address_village,
			personalInformation.home_address_sub_district,
			personalInformation.home_address_regency_code,
			personalInformation.home_address_province,
			personalInformation.home_address_postal_code,
			personalInformation.home_address_country,
		]

		if (!registeredAddressValues.some((value) => value !== undefined)) return

		if (!methods.getValues('home_address')) {
			methods.setValue('home_address', personalInformation.home_address || '')
		}
		if (!methods.getValues('home_address_village')) {
			methods.setValue('home_address_village', personalInformation.home_address_village || '')
		}
		if (!methods.getValues('home_address_sub_district')) {
			methods.setValue('home_address_sub_district', personalInformation.home_address_sub_district || '')
		}
		if (!methods.getValues('home_address_regency_code')) {
			methods.setValue('home_address_regency_code', personalInformation.home_address_regency_code || '')
		}
		if (!methods.getValues('home_address_province')) {
			methods.setValue('home_address_province', personalInformation.home_address_province || '')
		}
		if (!methods.getValues('home_address_postal_code')) {
			methods.setValue('home_address_postal_code', personalInformation.home_address_postal_code || '')
		}
		if (!methods.getValues('home_address_country')) {
			methods.setValue('home_address_country', personalInformation.home_address_country || '')
		}
		methods.setValue(
			'is_address_same',
			personalInformation.is_address_same ?? personalInformation.is_registered_address_same ?? false
		)

		hydratedAddressApplicationIdRef.current = currentIndiApp.id
	}, [currentIndiApp, methods, personalInformation])

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
				</fieldset>

				<div className="mt-4 flex justify-end">
					<Button
						type={isApplicationProcessing ? 'button' : 'submit'}
						variant="contained"
						size="large"
						onClick={isApplicationProcessing ? () => setSubStep('job_details') : undefined}
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

export default IndoPersonalInformationFormStep
