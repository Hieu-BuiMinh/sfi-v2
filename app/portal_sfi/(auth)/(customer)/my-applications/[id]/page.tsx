import CustomerApplicationDetailPageView from '@/views/portal_sfi/customer/pages/my-applications.page/application-detail/application-detail.page'

async function CustomerApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<CustomerApplicationDetailPageView id={id} />
		</div>
	)
}

export default CustomerApplicationDetail
