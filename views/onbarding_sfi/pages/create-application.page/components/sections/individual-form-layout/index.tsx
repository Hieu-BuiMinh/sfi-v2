import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import IndividualNationalitySelection from '@/views/onbarding_sfi/pages/create-application.page/components/sections/individual-nationality-selection'
import React, { ReactNode } from 'react'

function IndividualOnboardingFormLayout({ children }: { children: ReactNode }) {
	const { currentIndiApp } = useCustomerApplication()

	return (
		<div className="flex flex-col gap-4">
			<IndividualNationalitySelection />
			{currentIndiApp?.content?.nationality && children}
		</div>
	)
}

export default IndividualOnboardingFormLayout
