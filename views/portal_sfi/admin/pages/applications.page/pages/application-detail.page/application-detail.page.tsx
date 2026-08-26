import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import { AdminApplicationDetail } from '@/views/portal_sfi/admin/components/application-detail/admin-application-detail'
import { AdminApplicationFlowProvider } from '@/views/portal_sfi/admin/pages/applications.page/components/application-flow/application-flow-provider'
import AdminApplicationProvider from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'

function AdminApplicationDetailPageView({ id }: { id: string }) {
	const t = useTranslations('admin.applications.detail')
	if (!id) {
		redirect('/applications')
	}
	return (
		<AdminApplicationProvider id={id}>
			<AdminApplicationFlowProvider id={id}>
				<div className="flex flex-col gap-6">
					<BreadcrumbSfi
						items={[
							{ label: t('breadcrumb.admin'), href: '/dashboard' },
							{
								label: t('breadcrumb.application_list'),
								href: '/applications',
							},
							{ label: t('breadcrumb.application_detail') },
						]}
					/>

					{/* <SfiPageTitle title={t('title')} subtitle={t('subtitle')} /> */}

					<AdminApplicationDetail />
				</div>
			</AdminApplicationFlowProvider>
		</AdminApplicationProvider>
	)
}

export default AdminApplicationDetailPageView
