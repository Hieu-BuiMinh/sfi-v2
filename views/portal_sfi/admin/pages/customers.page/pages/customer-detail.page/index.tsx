/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import SfiAvatar from '@/components/avatar'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { adminApplicationService } from '@/services/admin/applications'
import AdminApplicationProvider, {
	useAdminApplication,
} from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import CustomerSideMenu, {
	TCustomerSideMenuSection,
} from '@/views/portal_sfi/admin/pages/customers.page/components/customer-side-menu'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import { Drawer, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import dayjs from '@/utils/dayjs'
import { useState } from 'react'

import { adminTradingAccountService } from '@/services/admin/trading-accounts'
import { adminCustomerAccountService } from '@/services/admin/users/customers/accounts'
import { AccountStatCard } from '@/views/portal_sfi/admin/components/account-stat'
import { AdminApplicationNav } from '@/views/portal_sfi/admin/components/application-detail/admin-application-nav'
import { LoginJournalTable } from '@/views/portal_sfi/admin/components/login-journal-table'
import BindAccountButton from '@/views/portal_sfi/admin/pages/customers.page/components/bind-account-button'
import CustomeraAccountTab from '@/views/portal_sfi/admin/pages/customers.page/components/customer-account-tabs'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import ApplicationTypeChip from '@/components/chips/application-type-chip'
import { useLoginJournalTableParams } from '@/views/portal_sfi/admin/pages/customers.page/hooks/use-login-journal-table-params'

interface AdminCustomerDetailViewProps {
	id: string
	applicationId: string
}

const AdminCustomerDetailView = ({ id, applicationId }: AdminCustomerDetailViewProps) => {
	const t = useTranslations('admin.customers.detail')
	const [activeMenuId, setActiveMenuId] = useState<string>('application')
	const [params, setParams] = useLoginJournalTableParams()
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)

	const { data: applicationData, isLoading: isApplicationLoading } = useQuery({
		queryKey: adminApplicationService.getApplicationById.key(applicationId),
		queryFn: () => adminApplicationService.getApplicationById.get(applicationId),
		enabled: !!applicationId,
	})

	const application = applicationData?.data?.application
	const userEmail = application?.user?.email

	const { data: accountsData } = useQuery({
		queryKey: adminCustomerAccountService.getAccountsByType.key(userEmail || ''),
		queryFn: () => adminCustomerAccountService.getAccountsByType.get(userEmail || ''),
		enabled: !!userEmail,
	})

	const accounts = accountsData?.data

	const { data: accountListData } = useQuery({
		queryKey: adminTradingAccountService.getTradingAccountList.key({
			email: userEmail,
		}),
		queryFn: () =>
			adminTradingAccountService.getTradingAccountList.get({
				email: userEmail,
			}),
		enabled: !!userEmail,
	})

	const accountList = accountListData?.data || []

	const sideMenuConfig: TCustomerSideMenuSection[] = [
		{
			title: t('sidebar.general_info'),
			items: [
				{
					id: 'application',
					label: t('sidebar.application'),
					content: (
						<AdminApplicationNav
							applicationId={application?.id}
							nationality={application?.content?.nationality}
						/>
					),
				},
				{
					id: 'login-journal',
					label: t('sidebar.login_journal'),
					content: (
						<LoginJournalTable auth0Id={application?.user?.auth0} params={params} setParams={setParams} />
					),
				},
			],
		},
		{
			title: t('sidebar.accounts'),
			items: [
				{
					id: 'accounts',
					isAction: true,
					label: <BindAccountButton email={userEmail} applicationId={application?.id} />,
					content: null,
				},

				...(accounts?.live || []).map((acc) => {
					const foundAccount = accountList.find((a) => a.account_id === acc.Login)
					const status = foundAccount?.type || 'LIVE'

					return {
						id: `account-live-${acc.Login}`,
						label: (
							<AccountStatCard
								id={acc.CrmId}
								email={acc.Email}
								isActive={!!acc.mt5_account.Login && (foundAccount?.status ?? true)}
								status={status}
								accountNo={acc.Login}
								mt5Account={acc.mt5_account.Login}
								balance={acc.mt5_account.Balance}
								equity={acc.mt5_account.Equity}
								margin={acc.mt5_account.Margin}
							/>
						),
						content: <CustomeraAccountTab accountNo={acc.Login} type="LIVE" />,
					}
				}),
				...(accounts?.demo || []).map((acc) => {
					const foundAccount = accountList.find((a) => a.account_id === acc.Login)
					const status = foundAccount?.type || 'DEMO'

					return {
						id: `account-demo-${acc.Login}`,
						label: (
							<AccountStatCard
								id={acc.CrmId}
								email={acc.Email}
								isActive={!!acc.mt5_account.Login && (foundAccount?.status ?? true)}
								status={status}
								accountNo={acc.Login}
								mt5Account={acc.mt5_account.Login}
								balance={acc.mt5_account.Balance}
								equity={acc.mt5_account.Equity}
								margin={acc.mt5_account.Margin}
							/>
						),
						content: <CustomeraAccountTab accountNo={acc.Login} type="DEMO" />,
					}
				}),
			],
		},
	]

	const activeContent = sideMenuConfig.flatMap((s) => s.items).find((i) => i.id === activeMenuId)?.content

	return (
		<AdminApplicationProvider id={applicationId}>
			<div className="flex w-full flex-col gap-6 pb-10">
				<BreadcrumbSfi
					items={[
						{ label: t('breadcrumb.admin'), href: '/dashboard' },
						{ label: t('breadcrumb.customer_list'), href: '/customers' },
						{ label: t('breadcrumb.customer_detail') },
					]}
				/>

				<SfiPageTitle title={t('title')} subtitle={t('subtitle', { id: applicationId })} />

				<div className="relative flex items-start gap-6">
					{/* Static Sidebar for Desktop */}
					<div className="sticky top-4 hidden w-70 shrink-0 lg:block">
						<CustomerSideMenu
							sections={sideMenuConfig}
							activeId={activeMenuId}
							onSelect={setActiveMenuId}
						/>
					</div>

					{/* Drawer for Mobile/Tablet */}
					<Drawer
						anchor="left"
						open={isDrawerOpen}
						onClose={() => setIsDrawerOpen(false)}
						sx={{
							'& .MuiDrawer-paper': {
								width: 280,
								padding: 2,
							},
						}}
					>
						<CustomerSideMenu
							sections={sideMenuConfig}
							activeId={activeMenuId}
							onSelect={(id) => {
								setActiveMenuId(id)
								setIsDrawerOpen(false)
							}}
						/>
					</Drawer>

					<div className="flex min-h-100 flex-1 flex-col gap-4 overflow-hidden">
						<div className="border-mui-divider bg-mui-bg-paper flex items-center gap-3 rounded-xl border p-4">
							<div className="lg:hidden">
								<IconButton
									onClick={() => setIsDrawerOpen(true)}
									className="bg-mui-bg-paper border-mui-divider border"
								>
									<KeyboardDoubleArrowRightIcon className="text-mui-text-primary h-6 w-6" />
								</IconButton>
							</div>

							<div className="min-w-0 flex-1">
								<UserInfo userId={id} />
							</div>
						</div>
						<div>{activeContent}</div>
					</div>
				</div>
			</div>
		</AdminApplicationProvider>
	)
}

export default AdminCustomerDetailView

const UserInfo = ({ userId }: { userId: string }) => {
	const t = useTranslations('admin.customers.detail')
	const { applicationQuery } = useAdminApplication()
	const { data, isLoading } = applicationQuery
	const application = data?.data?.application

	if (isLoading) return <div className="h-16 w-80 animate-pulse rounded-xl bg-gray-100" />

	const user = {
		name: application?.user?.name || application?.user?.email || t('user_info.unknown_user'),
		email: application?.user?.email || '_',
		user_id: userId || '_',
		country: application?.content?.nationality || 'ID',
		account_type: application?.application_type?.name || t('user_info.individual'),
		joined_at: application?.created_at ? dayjs(application.created_at).format('YYYY-MM-DD HH:mm') : '_',
	}

	const handleCopyId = () => {
		if (user.user_id !== '_') {
			navigator.clipboard.writeText(user.user_id)
		}
	}

	return (
		<div className="flex min-w-0 items-center gap-4">
			{/* Avatar */}
			<SfiAvatar
				sx={{ width: 44, height: 44, fontSize: '1rem' }}
				name={
					application?.content?.customer_particular?.personal_information?.full_name ||
					application?.user?.email
				}
			/>

			<div className="flex min-w-0 flex-col gap-1.5">
				<div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
					<span className="text-base leading-none font-bold wrap-break-word">{user.name}</span>
					{application?.user?.name && (
						<span className="text-mui-text-secondary text-sm font-medium">({user.email})</span>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						className="group hover:bg-mui-primary-alpha/5 flex h-6 cursor-pointer items-center gap-1.5 rounded px-1 transition-colors"
						onClick={handleCopyId}
						title={t('user_info.application_id')}
					>
						<span className="text-mui-text-secondary font-mono text-xs select-all">
							{t('user_info.application_id')}: {user.user_id}
						</span>
						<ContentCopyRoundedIcon className="text-mui-text-secondary group-hover:text-mui-primary h-3 w-3" />
					</button>

					<div className="bg-mui-divider h-3 w-px" />

					<div className="flex items-center gap-2">
						<ApplicationTypeChip type={user.account_type} />
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-1.5 text-xs">
					<span className="text-mui-primary bg-mui-primary-alpha/5 rounded px-1.5 py-0.5 font-medium">
						{t('user_info.joined')}
					</span>
					<span className="text-mui-text-secondary font-medium italic">{user.joined_at}</span>
					<div className="bg-mui-divider h-3 w-px" />
					{/* user name */}
					<span className="text-mui-text-secondary font-medium">
						{application?.content?.customer_particular?.personal_information?.full_name}
					</span>
				</div>
			</div>
		</div>
	)
}
