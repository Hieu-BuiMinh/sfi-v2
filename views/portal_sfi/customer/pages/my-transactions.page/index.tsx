/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { customerAccountService } from '@/services/customer/account'
import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { useEffect, useMemo } from 'react'

import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import { SfiOption } from '@/components/inputs/types'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiTabs, { SfiTabItem } from '@/components/tab/sfi-tab-default'
import SfiPageTitle from '@/components/wording/page-title'
import { useDevice } from '@/hooks/use-device'
import AccountSelectOption from '@/views/portal_sfi/components/account-select-option'
import TransactionTable from './components/transaction-table'

function MyTransactionsPageView() {
	const t = useTranslations('customer.transactions')
	const router = useRouter()
	const { isMobile, isTablet } = useDevice()
	const [selectedAccount, setSelectedAccount] = useQueryState('account', { defaultValue: '' })

	const TABS: SfiTabItem[] = useMemo(
		() => [
			{
				key: 'deposit',
				label: t('tabs.deposit'),
				content: <TransactionTable loginId={selectedAccount} type="deposit" />,
			},
			{
				key: 'withdrawal',
				label: t('tabs.withdrawal'),
				content: <TransactionTable loginId={selectedAccount} type="withdraw" />,
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
			value: String(account.BindingAccount),
		}))

		const demo = (demoAccounts?.data || []).map((account) => ({
			label: <AccountSelectOption account={account} type="TRIAL" />,
			value: String(account.BindingAccount),
		}))

		return [...live, ...demo]
	}, [liveAccounts, demoAccounts])

	useEffect(() => {
		if (accountsOptions.length > 0 && !selectedAccount) {
			setSelectedAccount(accountsOptions[0].value)
		}
	}, [accountsOptions, selectedAccount])

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.home'), href: '/my-dashboard' },
					{ label: t('breadcrumb.current'), href: '/my-transactions' },
				]}
			/>

			<div className="flex flex-col flex-wrap gap-6 md:flex-row md:items-center md:justify-between">
				<SfiPageTitle
					title={
						<div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4">
							<span className="shrink-0 text-2xl font-bold">{t('title')}</span>
							<SfiSingleSelect
								options={accountsOptions}
								value={selectedAccount}
								onChange={(e) => setSelectedAccount(e.target.value as string)}
								sx={{ width: isMobile || isTablet ? '100%' : 400 }}
								fullWidth={isMobile || isTablet}
								placeholder={t('select_account')}
								size="medium"
							/>
						</div>
					}
				/>

				<div className="grid grid-cols-2 gap-3 sm:flex sm:shrink-0 sm:gap-4">
					<Button
						variant="contained"
						color="white"
						className="w-full md:w-auto"
						sx={{ py: isMobile ? 1.5 : 1 }}
						disabled={!selectedAccount}
						onClick={() => router.push(`/my-transactions/withdrawal?account=${selectedAccount}`)}
					>
						{t('withdraw_fund')}
					</Button>
					<Button
						variant="contained"
						className="w-full md:w-auto"
						sx={{ py: isMobile ? 1.5 : 1 }}
						disabled={!selectedAccount}
						onClick={() => router.push(`/my-transactions/deposit?account=${selectedAccount}`)}
					>
						{t('make_deposit')}
					</Button>
				</div>
			</div>

			<div className="w-full overflow-hidden">
				<SfiTabs
					items={TABS}
					defaultKey="deposit"
					tabProps={{
						sx: {
							minWidth: isMobile ? '50%' : 200,
							p: isMobile ? '12px 8px' : '16px 12px',
						},
					}}
				/>
			</div>
		</div>
	)
}

export default MyTransactionsPageView
