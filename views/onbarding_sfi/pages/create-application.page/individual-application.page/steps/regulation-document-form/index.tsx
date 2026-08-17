'use client'

import RfhSfiCheckbox from '@/components/rhf-inputs/rfh-sfi-checkbox'
import useProfile from '@/hooks/use-profile'
import { customerSfiService } from '@/services/customer/sfi'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress, Divider } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import {
	REGULATION_CONFIRMATION_FIELDS,
	REGULATION_DECLARATIONS,
	REGULATION_DOCUMENTS,
	RegulationDocumentFormData,
	regulationDocumentSchema,
} from './form-validate/schema'
import toastUtil from '@/utils/toast'

const checkboxContainerClassName =
	'[&_.MuiFormControlLabel-root]:m-0 [&_.MuiFormControlLabel-root]:items-start [&_.MuiFormControlLabel-label]:pt-2'

function IndividualRegulationDocumentStep() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const { user } = useProfile()
	const confirmDocument = currentIndiApp?.content?.confirm_document
	const userId = user?.id || ''

	const methods = useForm<RegulationDocumentFormData>({
		resolver: zodResolver(regulationDocumentSchema),
		mode: 'onChange',
		defaultValues: {
			confirm_understand: confirmDocument?.confirm_understand || false,
			commodity_broker_profile: confirmDocument?.commodity_broker_profile || false,
			trading_simulation_statement: confirmDocument?.trading_simulation_statement || false,
			risk_disclosure_statement: confirmDocument?.risk_disclosure_statement || false,
			account_opening_application: confirmDocument?.account_opening_application || false,
			commodity_trading_agreement: confirmDocument?.commodity_trading_agreement || false,
			nano_contract_trading_rules: confirmDocument?.nano_contract_trading_rules || false,
			customer_fund_statement: confirmDocument?.customer_fund_statement || false,
			trading_platform_terms: confirmDocument?.trading_platform_terms || false,
			personal_data_consent: confirmDocument?.personal_data_consent || false,
			employment_declaration: confirmDocument?.employment_declaration || false,
			bankruptcy_declaration: confirmDocument?.bankruptcy_declaration || false,
			information_accuracy_declaration: confirmDocument?.information_accuracy_declaration || false,
			indemnity_declaration: confirmDocument?.indemnity_declaration || false,
		},
	})

	const pdfMutation = useMutation({
		mutationFn: customerSfiService.getTermOfUsePdf.get,
	})

	const handleOpenDocument = (pdfType: string) => {
		if (!userId) return

		const pdfWindow = window.open('', '_blank')
		if (!pdfWindow) return

		pdfWindow.opener = null
		pdfMutation.mutate(
			{ userId, pdfType },
			{
				onSuccess: (pdf) => {
					const objectUrl = URL.createObjectURL(pdf)
					pdfWindow.location.href = objectUrl
					window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
				},
				onError: () => pdfWindow.close(),
			}
		)
	}

	const handleConfirmAll = (checked: boolean) => {
		methods.reset(
			Object.fromEntries(
				['confirm_understand', ...REGULATION_CONFIRMATION_FIELDS].map((field) => [field, checked])
			) as RegulationDocumentFormData
		)
		methods.trigger()
	}

	const onSubmit = (data: RegulationDocumentFormData) => {
		if (!currentIndiApp) return

		updateApplicationMutation.mutate(
			{
				data: {
					...currentIndiApp,
					content: {
						...currentIndiApp.content,
						confirm_document: data,
					},
				},
			},
			{
				onSuccess: () => {
					toastUtil.success('Application saved. Please continue completing your application')
				},
			}
		)
	}

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5">
				<div>
					<h2 className="text-xl">Regulation document</h2>
					<p className="text-mui-text-secondary text-sm">
						Please Read All Terms & Conditions and Confirm the following Statements:
					</p>
				</div>

				<RfhSfiCheckbox
					name="confirm_understand"
					control={methods.control}
					label={
						<span className="font-semibold">
							By selecting this option, I confirm that I have read, understood, acknowledged, and agree to
							all the below statements, including the Terms and Conditions, and I acknowledge that this
							selection applies to all the below items.
						</span>
					}
					onChange={handleConfirmAll}
					containerClassName={checkboxContainerClassName}
				/>

				<div className="flex flex-col gap-2">
					{REGULATION_DOCUMENTS.map((document) => (
						<RfhSfiCheckbox
							key={document.name}
							name={document.name}
							control={methods.control}
							containerClassName={checkboxContainerClassName}
							label={
								<span className="block text-left leading-5">
									I have read, understood, and agree to the{' '}
									{pdfMutation.isPending && pdfMutation.variables?.pdfType === document.pdfType && (
										<CircularProgress size={10} aria-label="Loading document" className="mr-1" />
									)}
									<span
										onClick={(event) => {
											event.stopPropagation()
											handleOpenDocument(document.pdfType)
										}}
										className="text-mui-primary inline cursor-pointer p-0 text-left align-baseline underline"
									>
										{document.label}
									</span>
								</span>
							}
						/>
					))}
				</div>

				<Divider />

				<div className="flex flex-col gap-2">
					{REGULATION_DECLARATIONS.map((declaration) => (
						<RfhSfiCheckbox
							key={declaration.name}
							name={declaration.name}
							control={methods.control}
							containerClassName={checkboxContainerClassName}
							label={<span className="block text-left leading-5">{declaration.label}</span>}
						/>
					))}
				</div>

				<div className="flex justify-end">
					<Button
						type="submit"
						variant="contained"
						size="large"
						disabled={updateApplicationMutation.isPending || !methods.formState.isValid}
					>
						{updateApplicationMutation.isPending ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							'Acknowledge and Understand'
						)}
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}

export default IndividualRegulationDocumentStep
