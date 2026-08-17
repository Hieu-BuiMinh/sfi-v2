import { CustomerApplicationProvider } from '@/views/onbarding_sfi/components/customer-application-provider'
import CorporateApplicationPageView from '@/views/onbarding_sfi/pages/create-application.page/corporate-application.page'
import IndividualApplicationPageView from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page'
import { redirect } from 'next/navigation'

interface PageProps {
	params: Promise<{ accountType: string }>
}

export default async function CreateApplicationPage({ params }: PageProps) {
	const { accountType } = await params

	switch (accountType) {
		case 'individual':
			return (
				<CustomerApplicationProvider>
					<IndividualApplicationPageView />
				</CustomerApplicationProvider>
			)
		case 'corporate':
			return (
				<CustomerApplicationProvider>
					<CorporateApplicationPageView />
				</CustomerApplicationProvider>
			)

		default:
			redirect('/register')
	}
}
