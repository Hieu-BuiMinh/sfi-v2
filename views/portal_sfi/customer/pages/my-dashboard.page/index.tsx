'use client'

import { customerAccountService } from '@/services/customer/account'
import SfiDashboardAssetPieChart from '@/views/portal_sfi/customer/components/charts/asset-chart'
import SfiDashboardLineChartEntity from '@/views/portal_sfi/customer/components/charts/equity-chart'
import { CustomerDashboardStatCard } from '@/views/portal_sfi/customer/components/stats-card/customer-dashboard-stat-card'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

function CustomerDashboardPageView() {
	const [accountId, setAccountId] = useState<string>('')
	const { data: currentAccount } = useQuery({
		queryKey: customerAccountService.getMt5AccountById.key({ id: accountId }),
		queryFn: () => customerAccountService.getMt5AccountById.get({ id: accountId }),
		enabled: !!accountId,
	})

	return (
		<div className="flex flex-col gap-5">
			<CustomerDashboardStatCard
				accountId={accountId}
				setAccountId={setAccountId}
				currentAccount={currentAccount?.data}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div className="min-w-0 lg:col-span-8">
					<div className="border-mui-divider bg-common-background flex h-full flex-col gap-4 rounded-md border px-5 py-4 shadow-sm">
						<SfiDashboardLineChartEntity currentAccount={currentAccount?.data} />
					</div>
				</div>

				<div className="min-w-0 lg:col-span-4">
					<div className="border-mui-divider bg-common-background flex h-full flex-col gap-4 rounded-md border px-5 py-4 shadow-sm">
						<SfiDashboardAssetPieChart currentAccount={currentAccount?.data} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default CustomerDashboardPageView
