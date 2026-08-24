'use client'

import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import { SfiOption } from '@/components/inputs/types'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiTabs, { SfiTabItem } from '@/components/tab/sfi-tab-default'
import SfiPageTitle from '@/components/wording/page-title'
import { useDevice } from '@/hooks/use-device'
import { customerAccountService } from '@/services/customer/account'
import AccountSelectOption from '@/views/portal_sfi/components/account-select-option'
import OrderHistory from '@/views/portal_sfi/customer/pages/my-positions.page/components/order-history'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

function MyPositionsPageView() {
	const t = useTranslations('customer.positions')
	const { isMobile } = useDevice()
	const [selectedAccount, setSelectedAccount] = useState<string>('')

	const TABS: SfiTabItem[] = useMemo(
		() => [
			{
				key: 'positions',
				label: t('tabs.positions'),
				content: <>...</>,
			},
			{
				key: 'orders',
				label: t('tabs.orders'),
				content: <>...</>,
			},
			{
				key: 'order-history',
				label: t('tabs.order_history'),
				content: <OrderHistory loginId={selectedAccount} />,
			},
			{
				key: 'trade-history',
				label: t('tabs.trade_history'),
				content: <>...</>,
			},
		],
		[selectedAccount, t]
	)

	const { data: liveAccounts } = useQuery({
		queryKey: customerAccountService.getAccountListByType.key({
			type: 'LIVE',
		}),
		queryFn: () => customerAccountService.getAccountListByType.get({ type: 'LIVE' }),
	})

	const { data: demoAccounts } = useQuery({
		queryKey: customerAccountService.getAccountListByType.key({
			type: 'TRIAL',
		}),
		queryFn: () => customerAccountService.getAccountListByType.get({ type: 'TRIAL' }),
	})

	const accountsOptions: SfiOption[] = useMemo(() => {
		const live = (liveAccounts?.data || []).map((account) => ({
			label: <AccountSelectOption account={account} type="LIVE" />,
			value: String(account.Login),
		}))

		const demo = (demoAccounts?.data || []).map((account) => ({
			label: <AccountSelectOption account={account} type="TRIAL" />,
			value: String(account.Login),
		}))

		return [...live, ...demo]
	}, [liveAccounts, demoAccounts])

	useEffect(() => {
		if (accountsOptions.length > 0 && !selectedAccount) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setSelectedAccount(accountsOptions[0].value)
		}
	}, [accountsOptions, selectedAccount])

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.home'), href: '/my-dashboard' },
					{ label: t('breadcrumb.current'), href: '/my-positions' },
				]}
			/>

			<SfiPageTitle
				title={
					<div className="flex w-full flex-wrap items-center gap-4">
						<span className="shrink-0 text-2xl font-bold">{t('title')}</span>
						<SfiSingleSelect
							options={accountsOptions}
							value={selectedAccount}
							onChange={(e) => setSelectedAccount(e.target.value as string)}
							sx={{ width: isMobile ? '100%' : 400 }}
							fullWidth={isMobile}
							placeholder={t('select_account')}
							size="medium"
						/>
					</div>
				}
			/>

			<SfiTabs items={TABS} defaultKey="positions" tabProps={{ sx: { minWidth: 200, p: '16px 12px' } }} />
		</div>
	)
}

export default MyPositionsPageView
