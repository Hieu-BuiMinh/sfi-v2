'use client'

import { useTranslations } from 'next-intl'
import { DashboardSummary } from './components/dashboard-summary'
import { useTableParams } from '@/hooks/use-table-params'
import SfiPageTitle from '@/components/wording/page-title'
import AdminApplicationFilter from '@/views/portal_sfi/admin/components/application-table/admin-application-filter'
import AdminApplicationTable from '@/views/portal_sfi/admin/components/application-table/admin-application-table'
import { d } from '@/utils/dayjs'

function AdminDashboardPageView() {
	const t = useTranslations('admin.dashboard')
	const [params, setParams] = useTableParams()

	return (
		<div className="flex flex-col gap-5">
			<SfiPageTitle
				title={t('title')}
				subtitle={<span className="text-mui-primary">{`${d().format('dddd, MMM DD, YYYY')}`}</span>}
			/>
			<DashboardSummary />

			<div className="mt-4 flex flex-col gap-4">
				<h2 className="text-xl font-bold">{t('recent_applications')}</h2>
				<AdminApplicationFilter params={params} setParams={setParams} />
				<AdminApplicationTable params={params} setParams={setParams} />
			</div>
		</div>
	)
}

export default AdminDashboardPageView
