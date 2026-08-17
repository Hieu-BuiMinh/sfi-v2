import OnboardingRegisterPageView from '@/views/onbarding_sfi/pages/register.page'
import { CustomerApplicationProvider } from '@/views/onbarding_sfi/components/customer-application-provider'

function OnboardingRegisterPage() {
	return (
		<CustomerApplicationProvider>
			<OnboardingRegisterPageView />
		</CustomerApplicationProvider>
	)
}

export default OnboardingRegisterPage
