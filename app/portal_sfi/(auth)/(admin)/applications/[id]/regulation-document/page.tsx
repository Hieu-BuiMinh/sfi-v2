import AdminApplicationRegulationDocumentPageView from '@/views/portal_sfi/admin/pages/applications.page/application-detail/regulation-document/regulation-document.page'

async function AdminApplicationRegulationDocumentPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<AdminApplicationRegulationDocumentPageView id={id} />
		</div>
	)
}

export default AdminApplicationRegulationDocumentPage
