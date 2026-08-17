'use client'

import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress } from '@mui/material'
import { useQueryState } from 'nuqs'
import { FormProvider, useForm } from 'react-hook-form'
import {
	INVESTMENT_OBJECTIVES_OPTIONS,
	TradingExperienceFormData,
	tradingExperienceSchema,
} from './form-validate/schema'
import TradingExperienceFormSection from './trading-experience-form-section'

function IndoTradingExperienceFormStep() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const isReadOnly = false
	const [, setSubStep] = useQueryState('subStep')
	const tradingExperience = currentIndiApp?.content?.customer_particular?.trading_experience

	const methods = useForm<TradingExperienceFormData>({
		resolver: zodResolver(tradingExperienceSchema),
		defaultValues: {
			investment_objectives: tradingExperience?.investment_objectives || INVESTMENT_OBJECTIVES_OPTIONS[0].value,
			experience_in_trading: tradingExperience?.experience_in_trading || 'yes',
			year_of_tradding: tradingExperience?.year_of_tradding || '',
			trading_acknowledgement: tradingExperience?.trading_acknowledgement || false,
		},
	})

	const onSubmit = (data: TradingExperienceFormData) => {
		if (!currentIndiApp) return

		const tradingExperienceData =
			data.experience_in_trading === 'yes'
				? { ...data, trading_acknowledgement: false }
				: { ...data, year_of_tradding: undefined }

		updateApplicationMutation.mutate(
			{
				data: {
					...currentIndiApp,
					content: {
						...currentIndiApp.content,
						customer_particular: {
							...currentIndiApp.content?.customer_particular,
							trading_experience: tradingExperienceData,
						},
					},
				},
			},
			{
				onSuccess: () => {
					setSubStep('bank_account')
				},
			}
		)
	}

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
				<fieldset disabled={isReadOnly} className="flex flex-col gap-6">
					<TradingExperienceFormSection />

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

export default IndoTradingExperienceFormStep
