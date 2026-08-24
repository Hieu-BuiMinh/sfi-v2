import RegulationDocumentPageView from '@/views/portal_sfi/customer/pages/my-applications.page/regulation-document/regulation-document.page'

async function RegulationDocumentPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<RegulationDocumentPageView id={id} />
		</div>
	)
}

export default RegulationDocumentPage
