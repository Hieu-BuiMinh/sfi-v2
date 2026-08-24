'use client'

import * as React from 'react'
import { LineChart } from '@mui/x-charts'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useQuery } from '@tanstack/react-query'
import { formatMoney } from '@/utils/money'
import { CustomerMT5Accountdetail } from '@/services/customer/account/account-res.dto'
import { customerAccountService } from '@/services/customer/account'

dayjs.extend(utc)

type Props = {
	currency?: string
	height?: number
	currentAccount?: CustomerMT5Accountdetail
}

type EquityMap = Record<string, number>

function formatDateUTC(unixSeconds: number) {
	return dayjs.unix(unixSeconds).utc().format('DD/MM/YYYY')
}

function buildXY(dailyEquity: EquityMap) {
	const points = Object.entries(dailyEquity)
		.map(([unixStr, y]) => ({
			unix: Number(unixStr),
			x: formatDateUTC(Number(unixStr)),
			y,
		}))
		.filter((p) => Number.isFinite(p.unix))
		.sort((a, b) => a.unix - b.unix)

	const map = new Map<string, number>()
	for (const p of points) map.set(p.x, p.y)

	const xData = Array.from(map.keys())
	const yData = Array.from(map.values())

	return { xData, yData }
}

const SfiDashboardLineChartEntity: React.FC<Props> = ({ currency, height = 300, currentAccount }) => {
	const {
		data: equityRes,
		isLoading,
		isError,
	} = useQuery({
		queryKey: customerAccountService.getAccountDailyEquity.key({
			id: currentAccount?.Login || '',
		}),
		queryFn: () =>
			customerAccountService.getAccountDailyEquity.get({
				id: currentAccount?.Login || '',
			}),
		enabled: Boolean(currentAccount?.Login),
	})

	const dailyEquity: EquityMap = React.useMemo(() => {
		const data = equityRes?.data
		if (!data) return {}
		return data as EquityMap
	}, [equityRes?.data])

	const { xData, yData } = React.useMemo(() => buildXY(dailyEquity), [dailyEquity])

	const yLabel = currency ? `Equity (${currency})` : 'Equity'

	if (!currentAccount?.Login) return <span className="h-100" />
	if (isLoading) return <div className="size-full animate-pulse rounded-xl bg-white/5" />
	if (isError) return <div className="size-full rounded-xl bg-white/5 p-4">Unable to load equity data</div>
	// if (xData.length === 0)
	//   return (
	//     <div className="size-full flex items-center justify-center rounded-xl bg-white/5 p-4">
	//       No data
	//     </div>
	//   )

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<p className="text-token-muted-foreground text-base font-bold">Equity</p>
				<p className="text-lg">{formatMoney(currentAccount?.Balance || 0)}</p>
			</div>

			<LineChart
				height={height}
				xAxis={[
					{
						scaleType: 'point',
						data: xData,
						label: 'Date',
					},
				]}
				yAxis={[
					{
						label: yLabel,
						width: 60,
						valueFormatter: (value: string | number | null | undefined) =>
							formatMoney(value, { compact: true }),
					},
				]}
				series={[
					{
						curve: 'monotoneX',
						data: yData,
						label: 'Equity',
						color: 'rgb(var(--mui-palette-primary-mainChannel))',
						// labelMarkType: 'square',
					},
				]}
				grid={{ vertical: true, horizontal: true }}
				sx={{
					[`& .${axisClasses.left} .${axisClasses.label}`]: {
						// transform: 'translateX(50px)',
						display: 'none',
					},
				}}
				margin={{ top: 10, right: 60, left: 0, bottom: 20 }}
			/>
		</div>
	)
}

export default SfiDashboardLineChartEntity
