'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import { adminStaffsService } from '@/services/admin/staffs'
import { Typography } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import StaffLogFilter from './components/staff-log-filter'
import StaffLogTable from './components/staff-log-table'

import { useTranslations } from 'next-intl'
import { useStaffActivitiesTableParams } from '@/views/portal_sfi/admin/pages/setting.page/pages/admin-authority.page/hooks/use-staff-activities-table-params'

interface AdminStaffLogPageViewProps {
	id: string
}

function AdminStaffLogPageView({ id }: AdminStaffLogPageViewProps) {
	const t = useTranslations('admin.settings.authority')
	const [params, setParams] = useStaffActivitiesTableParams()

	const { data: activitiesResponse, isLoading } = useQuery({
		queryKey: adminStaffsService.getActivities.key({
			id,
			page: params.page || 1,
			perPage: params.per_page || 10,
			search: params.search || undefined,
			from: (params.from as string) || undefined,
			to: (params.to as string) || undefined,
			event: (params.event as string) || undefined,
		}),
		queryFn: () =>
			adminStaffsService.getActivities.get({
				id,
				page: params.page || 1,
				perPage: params.per_page || 10,
				search: params.search || undefined,
				from: (params.from as string) || undefined,
				to: (params.to as string) || undefined,
				event: (params.event as string) || undefined,
			}),
		placeholderData: keepPreviousData,
	})

	const activities = activitiesResponse?.data?.data || []
	const total = activitiesResponse?.data?.total || 0

	const breadcrumbItems = [
		{ label: t('breadcrumb.admin'), href: '/dashboard' },
		{ label: t('breadcrumb.authority'), href: '/settings/authority' },
		{ label: t('breadcrumb.staff'), href: '/settings/authority' },
		{ label: t('breadcrumb.activity_log') },
	]

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<BreadcrumbSfi items={breadcrumbItems} />
				<Typography variant="h5" className="font-bold text-gray-900 dark:text-gray-100">
					{t('detail.staff_log.title')}
				</Typography>
			</div>

			<StaffLogFilter params={params} setParams={setParams} />

			<StaffLogTable data={activities} total={total} loading={isLoading} params={params} setParams={setParams} />
		</div>
	)
}

export default AdminStaffLogPageView
