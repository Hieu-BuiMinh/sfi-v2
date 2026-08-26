'use client'

import SfiApplicationChip from '@/components/chips/application-chip'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import { SfiTable } from '@/components/table'
import SfiPageTitle from '@/components/wording/page-title'
import { getAppConfigVariables } from '@/configs'
import { APPLICATION_STATUS } from '@/dto/enums/application'
import { useAuth } from '@/hooks/use-auth'
import { useCustomerApplicationsTableParams } from './hooks/use-customer-applications-table-params'
import { adminApplicationService } from '@/services/admin/applications'
import { TApplication } from '@/services/admin/applications/applications-res.dto'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

const PAGINATION_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

function MyApplicationsPageView() {
	const [params, setParams] = useCustomerApplicationsTableParams()
	const { auth } = useAuth()
	const auth0Id = auth?.sub || ''
	const onboardingPage =
		typeof window === 'undefined' ? '#' : getAppConfigVariables(window.location.host)?.pages?.onboarding_page || '#'

	const { data: response, isLoading } = useQuery({
		queryKey: adminApplicationService.getApplicationsByAuth0Id.key({ auth0Id }),
		queryFn: () => adminApplicationService.getApplicationsByAuth0Id.get({ auth0Id }),
		enabled: !!auth0Id,
	})

	const applications = response?.data || []

	const showOnboardButton =
		!isLoading &&
		(applications.length === 0 || applications.every((app) => app.status === APPLICATION_STATUS.STATUS_REJECT))

	const columns: GridColDef<TApplication>[] = [
		{
			field: 'id',
			headerName: 'Application ID',
			width: 150,
			renderCell: (row) => (
				<Link className="underline" href={`/my-applications/${row.id}`}>
					{row.id}
				</Link>
			),
		},
		{
			field: 'type',
			headerName: 'Type',
			width: 150,
			valueGetter: (_, row) => row.application_type?.name || '-',
		},
		{
			field: 'entity',
			headerName: 'Entity',
			width: 120,
			valueGetter: (_, row) => row.application_entity?.name || '-',
		},
		{
			field: 'products',
			headerName: 'Products',
			flex: 1,
			minWidth: 200,
			valueGetter: (_, row) => row.application_products?.map((p) => p.name).join(', ') || '-',
		},
		{
			field: 'status',
			headerName: 'Status',
			width: 150,
			renderCell: (params) => {
				const status = params.value as APPLICATION_STATUS
				return <SfiApplicationChip status={status} />
			},
		},
		{
			field: 'created_at',
			headerName: 'Created At',
			width: 160,
			valueFormatter: (value) => dayjs(value).format('DD/MM/YYYY HH:mm'),
		},
		{
			field: 'actions',
			headerName: 'Actions',
			width: 150,
			sortable: false,
			renderCell: (row) => (
				<Box>
					<Tooltip title="View application">
						<Link href={`/my-applications/${row.id}`}>
							<IconButton size="small">
								<VisibilityIcon fontSize="small" />
							</IconButton>
						</Link>
					</Tooltip>
				</Box>
			),
		},
	]

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: 'Home', href: '/my-dashboard' },
					{ label: 'Application list' }, // current page
				]}
			/>

			<div className="flex items-center justify-between gap-4">
				<SfiPageTitle title="Applications" />
				{showOnboardButton && (
					<Link href={onboardingPage || '#'}>
						<Button variant="contained" color="primary">
							New Application
						</Button>
					</Link>
				)}
			</div>

			<SfiTable params={params} setParams={setParams} rowCount={applications.length} loading={isLoading}>
				<SfiTable.Base
					rows={applications}
					columns={columns}
					paginationMode="client"
					sortingMode="client"
					hidePagination
				/>

				<SfiTable.Pagination
					color="primary"
					variant="outlined"
					shape="rounded"
					rowsPerPageOptions={PAGINATION_PAGE_SIZE_OPTIONS}
					showTotalCount
				/>
			</SfiTable>
		</div>
	)
}

export default MyApplicationsPageView
