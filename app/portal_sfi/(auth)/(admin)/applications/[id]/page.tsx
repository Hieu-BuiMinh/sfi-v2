import AdminApplicationDetailPageView from '@/views/portal_sfi/admin/pages/applications.page/pages/application-detail.page/application-detail.page'

async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<AdminApplicationDetailPageView id={id} />
		</div>
	)
}

export default ApplicationDetail
