import LegalDocumentDetailPageView from '@/views/portal_sfi/admin/pages/setting.page/pages/legal-documents.page/pages/detail.page'

interface LegalDocumentDetailPageProps {
	params: Promise<{ name: string }>
}

async function LegalDocumentDetailPage({ params }: LegalDocumentDetailPageProps) {
	const { name } = await params

	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<LegalDocumentDetailPageView name={name} />
		</div>
	)
}

export default LegalDocumentDetailPage
