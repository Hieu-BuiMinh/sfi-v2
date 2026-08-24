'use client'

import React, { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import LiveAccountList from './components/live-account-list'
import DemoAccountList from './components/demo-account-list'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiTabs, { SfiTabItem } from '@/components/tab/sfi-tab-default'
import SfiPageTitle from '@/components/wording/page-title'
import { customerAccountService } from '@/services/customer/account'
import { customerSfiService } from '@/services/customer/sfi'
import { Button } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toastUtil from '@/utils/toast'

function MyAccountsPageView() {
	const t = useTranslations('customer.accounts')
	const [activeTab, setActiveTab] = useState('live')
	const queryClient = useQueryClient()
	const { mutate: resetTrialBalance, isPending: isResetting } = useMutation({
		mutationKey: customerSfiService.resetTrialBalance.key(),
		mutationFn: customerSfiService.resetTrialBalance.post,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: customerAccountService.getAccountListByType.key({ type: 'TRIAL' }),
			})
			toastUtil.success(t('reset_success'))
		},
		onError: () => toastUtil.error(t('reset_error')),
	})
	const TABS: SfiTabItem[] = useMemo(
		() => [
			{
				key: 'live',
				label: t('tabs.live'),
				content: <LiveAccountList />,
			},
			{
				key: 'demo',
				label: t('tabs.demo'),
				content: <DemoAccountList />,
			},
		],
		[t]
	)

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.home'), href: '/my-dashboard' },
					{ label: t('breadcrumb.current'), href: '/my-accounts' },
				]}
			/>

			<SfiPageTitle title={t('title')} subtitle={t('subtitle')} />

			<SfiTabs
				items={TABS}
				value={activeTab}
				onChange={setActiveTab}
				tabProps={{ sx: { minWidth: 200, p: '16px 12px' } }}
				endAdornment={
					activeTab === 'demo' ? (
						<Button variant="contained" disabled={isResetting} onClick={() => resetTrialBalance()}>
							{isResetting ? t('resetting') : t('reset')}
						</Button>
					) : null
				}
			/>
		</div>
	)
}

export default MyAccountsPageView
