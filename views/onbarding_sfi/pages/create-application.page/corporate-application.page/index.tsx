'use client'

import SfiCommonModal from '@/components/modals/common-modal'
import { adminApplicationService } from '@/services/admin/applications'
import toastUtil from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import CorporateApplicationFormSection from './corporate-application-form-section'
import { CorporateApplicationFormData, corporateApplicationSchema } from './form-validate/schema'

function CorporateApplicationPageView() {
	const router = useRouter()
	const [showSuccessModal, setShowSuccessModal] = useState(false)

	const methods = useForm<CorporateApplicationFormData>({
		resolver: zodResolver(corporateApplicationSchema),
		mode: 'onChange',
		defaultValues: {
			company_name: '',
			country_of_incorporation: '',
			business_registration_number: '',
			nature_of_business: '',
			business_address: '',
			estimated_annual_revenue_range: '',
			full_name: '',
			position_title: '',
			email_address: '',
			mobile_number: '',
			preferred_contact_method: '',
		},
	})

	const createCorporateMutation = useMutation({
		mutationKey: adminApplicationService.createCorporateManual.key(),
		mutationFn: adminApplicationService.createCorporateManual.post,
		onSuccess: () => setShowSuccessModal(true),
		onError: () => toastUtil.error('Failed to submit corporate registration'),
	})

	const onSubmit = (data: CorporateApplicationFormData) => {
		createCorporateMutation.mutate(data)
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
							<Button type="submit" variant="contained" disabled={createCorporateMutation.isPending}>
								{createCorporateMutation.isPending ? (
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
				onClose={() => router.push('/register')}
				title="Registration Submitted Successfully"
				hideCloseButton
				confirmBtn={{
					label: 'OK',
					onClick: () => router.push('/register'),
				}}
			>
				<Typography className="text-mui-text-secondary">
					Thank you for registering your interest in opening a Corporate Account. We will contact you within 1
					business day to assist with the onboarding process and required documentation.
				</Typography>
			</SfiCommonModal>
		</div>
	)
}

export default CorporateApplicationPageView
