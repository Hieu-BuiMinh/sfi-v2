import ApplicationCustomerParticularPageView from '@/views/portal_sfi/customer/pages/my-applications.page/customer-particular/customer-particular.page'

async function ApplicationCustomerParticularPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<ApplicationCustomerParticularPageView id={id} />
		</div>
	)
}

export default ApplicationCustomerParticularPage
