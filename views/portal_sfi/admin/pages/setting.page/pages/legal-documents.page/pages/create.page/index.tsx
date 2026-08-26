'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import LegalDocumentForm from '../../components/legal-document-form'

function CreateLegalDocumentPageView() {
	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[
					{ label: 'Legal Documents', href: '/settings/legal-documents' },
					{ label: 'Untitled Document' },
				]}
			/>
			<h1 className="text-base font-bold">New Entry</h1>
			<LegalDocumentForm />
		</div>
	)
}

export default CreateLegalDocumentPageView
