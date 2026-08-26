import AdminApplicationParticularPageView from '@/views/portal_sfi/admin/pages/applications.page/pages/application-detail.page/pages/customer-particular.page'

async function AdminApplicationParticularPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<AdminApplicationParticularPageView id={id} />
		</div>
	)
}

export default AdminApplicationParticularPage
