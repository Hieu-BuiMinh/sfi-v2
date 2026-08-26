'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminApplicationService } from '@/services/admin/applications'
import dayjs from 'dayjs'
import { useAdminApplicationsTableParams } from './hooks/use-admin-applications-table-params'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import AdminApplicationFilter from '@/views/portal_sfi/admin/components/application-table/admin-application-filter'
import AdminApplicationTable from '@/views/portal_sfi/admin/components/application-table/admin-application-table'

function AdminApplicationsPageView() {
	const t = useTranslations('admin.applications')
	const [params, setParams] = useAdminApplicationsTableParams()

	const { data: response } = useQuery({
		queryKey: adminApplicationService.getApplications.key({
			page: params.page,
			perPage: params.per_page,
			search: params.search,
			status: params.status === 'all' ? null : params.status,
			created_from: params.from ? dayjs(params.from).format('YYYY-MM-DD') : undefined,
			created_to: params.to ? `${dayjs(params.to).format('YYYY-MM-DD')} 23:59:59` : undefined,
		}),
		queryFn: () =>
			adminApplicationService.getApplications.get({
				page: params.page,
				perPage: params.per_page,
				search: params.search,
				status: params.status,
				created_from: params.from ? dayjs(params.from).format('YYYY-MM-DD') : undefined,
				created_to: params.to ? `${dayjs(params.to).format('YYYY-MM-DD')} 23:59:59` : undefined,
			}),
		placeholderData: keepPreviousData,
	})

	const statusLabels: Record<string, string> = {
		all: t('filter.status.all'),
		'0': t('filter.status.not_started'),
		'3': t('filter.status.pending'),
		'4': t('filter.status.processing'),
		'1': t('filter.status.approved'),
		'2': t('filter.status.rejected'),
	}

	const currentStatusLabel = statusLabels[params.status || 'all'] || 'All'

	return (
		<div className="flex w-full flex-col gap-5">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.admin'), href: '/dashboard' },
					{ label: t('breadcrumb.application_list') },
				]}
			/>

			<SfiPageTitle
				title={`${t('title')} - ${currentStatusLabel} (${response?.data?.total || 0})`}
				subtitle={t('subtitle')}
			/>

			<AdminApplicationFilter params={params} setParams={setParams} />

			<AdminApplicationTable params={params} setParams={setParams} />
		</div>
	)
}

export default AdminApplicationsPageView
