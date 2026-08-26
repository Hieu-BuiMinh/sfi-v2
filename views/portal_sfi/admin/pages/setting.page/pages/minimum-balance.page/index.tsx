'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { adminStaffSettingService } from '@/services/admin/staffs/admin-setting'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import MinimumBalanceLogsTable from './components/minimum-balance-logs-table'
import { useMinimumBalanceLogsTableParams } from './hooks/use-minimum-balance-logs-table-params'
import MinimumBalanceInit from '@/views/portal_sfi/admin/pages/setting.page/pages/minimum-balance.page/components/minimum-balance-init'

function MinimumBalancePageView() {
	const [params, setParams] = useMinimumBalanceLogsTableParams()
	const requestParams = {
		page: params.page,
		per_page: params.per_page,
		lang: 'en',
	}

	const { data: response, isLoading } = useQuery({
		queryKey: adminStaffSettingService.getLogs.key(requestParams),
		queryFn: () => adminStaffSettingService.getLogs.get(requestParams),
		placeholderData: keepPreviousData,
	})

	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'System settings', href: '/settings/authority' },
					{ label: 'Minimum Balance' },
				]}
			/>

			<SfiPageTitle title="Initial minimum balance" />

			<section className="border-mui-divider bg-mui-background-paper flex flex-col gap-4 rounded-lg border p-5">
				<MinimumBalanceInit />
			</section>

			<h2 className="text-base font-bold">Logs</h2>
			<MinimumBalanceLogsTable
				params={params}
				setParams={setParams}
				rows={response?.data.data ?? []}
				total={response?.data.total ?? 0}
				loading={isLoading}
			/>
		</div>
	)
}

export default MinimumBalancePageView
