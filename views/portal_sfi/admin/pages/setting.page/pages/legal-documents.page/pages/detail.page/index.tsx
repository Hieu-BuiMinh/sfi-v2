'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import { customerSfiService } from '@/services/customer/sfi'
import { useQuery } from '@tanstack/react-query'
import LegalDocumentForm from '../../components/legal-document-form'

interface LegalDocumentDetailPageViewProps {
	name: string
}

function LegalDocumentDetailPageView({ name }: LegalDocumentDetailPageViewProps) {
	const detailParams = { name }
	const { data: detailResponse, isLoading: isDetailLoading } = useQuery({
		queryKey: customerSfiService.getTermOfUseTemplateDetail.key(detailParams),
		queryFn: () => customerSfiService.getTermOfUseTemplateDetail.get(detailParams),
	})

	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[{ label: 'Legal Documents', href: '/settings/legal-documents' }, { label: `${name}.docx` }]}
			/>
			<h1 className="text-base font-bold">Edit Entry</h1>
			<LegalDocumentForm detail={detailResponse?.data} loading={isDetailLoading} />
		</div>
	)
}

export default LegalDocumentDetailPageView
