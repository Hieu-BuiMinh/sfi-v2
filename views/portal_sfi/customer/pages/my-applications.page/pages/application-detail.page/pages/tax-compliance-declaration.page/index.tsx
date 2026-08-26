'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { customerApplicationService } from '@/services/customer/applications'
import { CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

export default function CustomerTaxComplianceDeclarationPageView({ id }: { id: string }) {
	const t = useTranslations('customer.tax_compliance_declaration')
	const { data: response, isLoading } = useQuery({
		queryKey: customerApplicationService.getApplicationById.key({ id }),
		queryFn: () => customerApplicationService.getApplicationById.get({ id }),
		enabled: !!id,
	})

	const application = response?.data?.application

	if (isLoading) {
		return (
			<div className="flex h-96 w-full items-center justify-center">
				<CircularProgress />
			</div>
		)
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.home'), href: '/my-dashboard' },
					{ label: t('breadcrumb.application_list'), href: '/my-applications' },
					{
						label: t('breadcrumb.application_detail'),
						href: `/my-applications/${id}`,
					},
					{ label: t('breadcrumb.current') },
				]}
			/>

			<SfiPageTitle title={t('title')} />

			{/* <TaxComplianceDeclarationView data={application?.content} t={t} /> */}
		</div>
	)
}
