'use client'

import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { identityVerificationSchema, IdentityVerificationFormData } from './form-validate/schema'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { Button, CircularProgress } from '@mui/material'
import { parseAsInteger, useQueryState } from 'nuqs'
import IdentityVerificationFormSection from './identity-verification-form-section'
import { getAppConfig } from '@/utils/get-app-config'

function NonIndoIdentityVerificationFormStep() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const isReadOnly = false

	const [, setStep] = useQueryState('step', parseAsInteger)
	const [, setSubStep] = useQueryState('subStep')

	const methods = useForm<IdentityVerificationFormData>({
		resolver: zodResolver(identityVerificationSchema),
		defaultValues: {
			verification_document: 'passport',
			front: { file: null, previewUrl: '', base64: '' },
			selfie: { file: null, previewUrl: '', base64: '' },
		},
	})

	const onSubmit = (data: IdentityVerificationFormData) => {
		if (currentIndiApp) {
			const { front, selfie, ...identify_verification } = data
			const appConfig = getAppConfig()
			const apiBase = appConfig?.api || ''

			updateApplicationMutation.mutate(
				{
					data: {
						...currentIndiApp,
						content: {
							...currentIndiApp.content,
							customer_particular: {
								...currentIndiApp.content?.customer_particular,
								identify_verification: {
									...identify_verification,
									...(front?.previewUrl && {
										front: front.previewUrl.replace(`${apiBase}/storage/`, ''),
									}),
									...(selfie?.previewUrl && {
										selfie: selfie.previewUrl.replace(`${apiBase}/storage/`, ''),
									}),
								},
							},
						},
					},
				},
				{
					onSuccess: async () => {
						await setSubStep('personal_information')
						await setStep(0)
					},
				}
			)
		}
	}

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
				<fieldset disabled={isReadOnly} className="flex flex-col gap-6">
					<IdentityVerificationFormSection />

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

export default NonIndoIdentityVerificationFormStep
