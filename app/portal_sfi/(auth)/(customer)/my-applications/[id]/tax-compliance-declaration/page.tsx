import CustomerTaxComplianceDeclarationPageView from '@/views/portal_sfi/customer/pages/my-applications.page/application-detail/tax-compliance-declaration/tax-compliance-declaration.page'

async function CustomerTaxComplianceDeclarationPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<CustomerTaxComplianceDeclarationPageView id={id} />
		</div>
	)
}

export default CustomerTaxComplianceDeclarationPage
