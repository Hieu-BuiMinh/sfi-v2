'use client'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiTabs, { SfiTabItem } from '@/components/tab/sfi-tab-default'
import SfiPageTitle from '@/components/wording/page-title'
import AdminDepositGridView from '@/views/portal_sfi/admin/pages/transactions.page/components/deposit-tab'
import AdminWithdrawalGridView from '@/views/portal_sfi/admin/pages/transactions.page/components/withdrawal-tab'
import { useTranslations } from 'next-intl'

import { useQueryState } from 'nuqs'

function AdminTransactionsPageView() {
	const t = useTranslations('admin.transactions.list')
	const [tab, setTab] = useQueryState('tab', { defaultValue: 'deposit' })

	const tabs: SfiTabItem[] = [
		{
			key: 'deposit',
			label: t('tabs.deposit'),
			content: <AdminDepositGridView />,
		},
		{
			key: 'withdrawal',
			label: t('tabs.withdrawal'),
			content: <AdminWithdrawalGridView />,
		},
	]

	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.admin'), href: '/dashboard' },
					{ label: t('breadcrumb.transaction_list') },
				]}
			/>

			<SfiPageTitle title={t('title')} subtitle={t('subtitle')} />

			<SfiTabs items={tabs} value={tab} onChange={setTab} />
		</div>
	)
}

export default AdminTransactionsPageView
