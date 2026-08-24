import { customerAccountService } from '@/services/customer/account'
import { CustomerMT5Accountdetail } from '@/services/customer/account/account-res.dto'
import { PieChart } from '@mui/x-charts'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

type AssetDistributionItem = {
	name: string
	equityPercentage: number
}

function SfiDashboardAssetPieChart({ currentAccount }: { currentAccount?: CustomerMT5Accountdetail }) {
	const { data: accountAssetsDistributions } = useQuery({
		queryKey: customerAccountService.getAccountAssetsDistributions.key({
			id: currentAccount?.Login || '',
		}),
		queryFn: () =>
			customerAccountService.getAccountAssetsDistributions.get({
				id: currentAccount?.Login || '',
			}),
		enabled: !!currentAccount?.Login,
	})

	const fakeData: AssetDistributionItem[] = [
		{ name: 'AUDCAD.dem', equityPercentage: 4.594697983053348e-7 },
		{ name: 'BTCUSD.dem', equityPercentage: 0.00902038348739002 },
		{ name: 'ETHUSD.dem', equityPercentage: 0.0006398103815121974 },
		{ name: '#AMZN.dem', equityPercentage: 0.0022448188698398095 },
		{ name: '#AAPL.dem', equityPercentage: 0.0023401281624958435 },
	]

	const raw: AssetDistributionItem[] =
		((accountAssetsDistributions as AssetDistributionItem[] | undefined) ?? []).length > 0
			? (accountAssetsDistributions as unknown as AssetDistributionItem[])
			: fakeData

	const pieData = React.useMemo(() => {
		const cleaned = raw.filter((x) => x?.name && Number.isFinite(x.equityPercentage) && x.equityPercentage > 0)

		const total = cleaned.reduce((sum, x) => sum + x.equityPercentage, 0)
		if (total <= 0) return []

		// Normalize to 100%
		return cleaned.map((x, idx) => ({
			id: idx,
			label: x.name,
			value: (x.equityPercentage / total) * 100,
		}))
	}, [raw])

	return (
		<div className="flex size-full flex-col justify-between gap-5">
			<p className="text-token-muted-foreground text-base font-bold">Asset Distribution</p>

			<div className="flex flex-1 items-center justify-center">
				<PieChart
					series={[
						{
							data: pieData.length ? pieData : [{ id: 0, value: 100, label: 'No data' }],
							innerRadius: 55,
							outerRadius: 90,
							paddingAngle: 2,
							cornerRadius: 4,
							cx: '50%',
							valueFormatter: (item) => `${Number(item.value).toFixed(2)}%`,
						},
					]}
					width={250}
					height={300}
					slotProps={{
						legend: {
							position: { vertical: 'bottom', horizontal: 'center' },
							direction: 'horizontal',
						},
					}}
					margin={{ top: 0, bottom: 100, left: 0, right: 0 }}
				/>
			</div>
			<span></span>
		</div>
	)
}

export default SfiDashboardAssetPieChart
