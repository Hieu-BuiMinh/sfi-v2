/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import { customerAccountService } from '@/services/customer/account'
import { CustomerMT5Accountdetail } from '@/services/customer/account/account-res.dto'
import { cn } from '@/utils/cn'
import { formatMoney } from '@/utils/money'
import { SfiDashboardStatsCard } from '@/views/portal_sfi/customer/components/stats-card'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CandlestickChartOutlinedIcon from '@mui/icons-material/CandlestickChartOutlined'
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined'
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, useEffect, useMemo } from 'react'

export function CustomerDashboardStatCard({
	accountId,
	setAccountId,
	currentAccount,
}: {
	accountId?: string
	setAccountId?: Dispatch<React.SetStateAction<string>>
	currentAccount?: CustomerMT5Accountdetail
}) {
	const { data: accountList } = useQuery({
		queryKey: customerAccountService.getAccountList.key(),
		queryFn: () => customerAccountService.getAccountList.get({}),
	})

	const accountOptions = useMemo(
		() =>
			accountList?.data?.map((account) => ({
				label: (
					<span className="capitalize">
						{account.type}: {account.account_id}
					</span>
				),
				value: account.account_id,
			})) || [],
		[accountList]
	)

	useEffect(() => {
		if (accountOptions.length > 0) setAccountId?.(accountOptions[0].value)
	}, [accountOptions])

	return (
		<div className="flex flex-col items-end gap-5">
			<SfiSingleSelect
				onChange={(e) => setAccountId?.(e.target.value as string)}
				label="Account"
				value={accountId || ''}
				options={accountOptions}
				className="w-52!"
				size="small"
			/>

			<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<SfiDashboardStatsCard
					title="Estimated Balance"
					tooltip="Your current estimated account balance"
					icon={
						<AccountBalanceWalletOutlinedIcon className="text-mui-primary dark:text-token-muted-foreground" />
					}
					value={formatMoney(currentAccount?.Balance || 0)}
					unit="USD"
					tone="neutral"
				/>

				<SfiDashboardStatsCard
					title="Daily P&L"
					tooltip="Your profit and loss for the current day"
					icon={<ShowChartOutlinedIcon className="text-mui-primary dark:text-token-muted-foreground" />}
					value={
						<span className={cn(Number(currentAccount?.Floating) > 0 ? 'text-green-400' : 'text-red-500')}>
							{formatMoney(currentAccount?.Floating || 0)}
						</span>
					}
					unit="USD"
					tone="positive"
				/>

				<SfiDashboardStatsCard
					title="Margin / Free Margin"
					tooltip="Your used margin and available free margin"
					icon={<PieChartOutlineOutlinedIcon className="text-mui-primary dark:text-token-muted-foreground" />}
					value={
						<>
							{formatMoney(currentAccount?.Margin || 0)}/{formatMoney(currentAccount?.MarginFree || 0)}
						</>
					}
					unit="USD"
				/>

				<SfiDashboardStatsCard
					title="Positions / Deals"
					tooltip="Your total positions and deals"
					icon={
						<CandlestickChartOutlinedIcon className="text-mui-primary dark:text-token-muted-foreground" />
					}
					value={
						<>
							{formatMoney(currentAccount?.TotalPositions || 0, { digits: 0 })}/
							{formatMoney(currentAccount?.TotalDeals || 0, { digits: 0 })}
						</>
					}
				/>
			</div>
		</div>
	)
}
