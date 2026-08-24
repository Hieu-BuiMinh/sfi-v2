import TaxComplianceDeclarationPageView from '@/views/portal_sfi/admin/pages/applications.page/application-detail/tax-compliance-declaration/tax-compliance-declaration.page'

export default async function TaxComplianceDeclarationPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<TaxComplianceDeclarationPageView id={id} />
		</div>
	)
}
