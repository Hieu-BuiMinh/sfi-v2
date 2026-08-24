'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import TaxComplianceDeclarationView from '@/views/portal_sfi/admin/components/application-detail/tax-compliance-declaration-view'
import AdminApplicationProvider, {
	useAdminApplication,
} from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import { CircularProgress } from '@mui/material'
import { useTranslations } from 'next-intl'

function TaxComplianceDeclarationContent({ id }: { id: string }) {
	const t = useTranslations('admin.applications.detail.tax_compliance_declaration')
	const tb = useTranslations('admin.applications.detail.breadcrumb')
	const { applicationQuery } = useAdminApplication()
	const { data, isLoading } = applicationQuery
	const application = data?.data?.application

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
					{ label: tb('admin'), href: '/dashboard' },
					{ label: tb('application_list'), href: '/applications' },
					{ label: tb('application_detail'), href: `/applications/${id}` },
					{ label: tb('tax_compliance') },
				]}
			/>

			<SfiPageTitle title={t('title')} />

			<TaxComplianceDeclarationView data={application?.content} t={t} />
		</div>
	)
}

export default function TaxComplianceDeclarationPageView({ id }: { id: string }) {
	return (
		<AdminApplicationProvider id={id}>
			<TaxComplianceDeclarationContent id={id} />
		</AdminApplicationProvider>
	)
}
