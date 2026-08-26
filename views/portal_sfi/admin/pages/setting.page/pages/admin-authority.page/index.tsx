'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiTabButton, { SfiTabButtonItem } from '@/components/tab/sfi-tab-button'
import SfiPageTitle from '@/components/wording/page-title'
import { useQueryState } from 'nuqs'
import AdminRoleTab from './components/role-tab'
import AdminStaffTab from './components/staff-tab'

import { useTranslations } from 'next-intl'

function AdminAuthorityPageView() {
	const t = useTranslations('admin.settings.authority')
	const [tab, setTab] = useQueryState('tab', { defaultValue: 'staff' })

	const TABS: SfiTabButtonItem[] = [
		{
			key: 'staff',
			label: t('tabs.staff'),
			content: <AdminStaffTab />,
		},
		{
			key: 'roles',
			label: t('tabs.roles'),
			content: <AdminRoleTab />,
		},
	]

	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.admin'), href: '/dashboard' },
					{ label: t('breadcrumb.authority'), href: '/settings/authority' },
					{
						label: tab === 'roles' ? t('breadcrumb.roles') : t('breadcrumb.staff'),
					},
				]}
			/>

			<div className="flex items-center justify-between">
				<SfiPageTitle title={t('title')} subtitle={t('subtitle')} />
			</div>

			<div className="flex flex-col gap-4">
				<SfiTabButton
					items={TABS}
					value={tab || 'staff'}
					onChange={(val) => setTab(val)}
					className="flex-1"
					defaultKey="staff"
					buttonProps={{
						className: 'w-50',
					}}
				/>
			</div>
		</div>
	)
}

export default AdminAuthorityPageView
