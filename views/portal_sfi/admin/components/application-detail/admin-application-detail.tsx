'use client'

import BaseAvatar from '@/components/avatar'
import SfiApplicationChip from '@/components/chips/application-chip'
import { TApplication } from '@/services/admin/applications/applications-res.dto'
import { AdminApplicationNav } from '@/views/portal_sfi/admin/components/application-detail/admin-application-nav'
import AdminFlowStep from '@/views/portal_sfi/admin/pages/applications.page/components/application-flow/admin-flow-step'
import ApplicationApproveButton from '@/views/portal_sfi/admin/pages/applications.page/components/application-flow/approval-button'
import { useAdminApplication } from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import { Divider, Skeleton } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'

const getUserMetaInfo = (application: TApplication | undefined, t: (key: string) => string) => [
	{ key: 'email', label: t('info.email'), value: application?.user?.email },
	{
		key: 'trading_number',
		label: t('info.trading_number'),
		value: application?.content?.customer_particular?.bank_account?.account_number,
	},
	{
		key: 'product',
		label: t('info.product'),
		value: application?.application_products?.[0]?.name,
	},
]

export function AdminApplicationDetail() {
	const t = useTranslations('admin.applications.detail')
	const router = useRouter()
	const { applicationQuery } = useAdminApplication()
	const { data, isLoading } = applicationQuery
	const application = data?.data?.application
	const metaInfo = getUserMetaInfo(application, t)

	if (!application && !isLoading) {
		router.push('/applications')
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<div className="flex flex-col items-center justify-between gap-3 md:flex-row">
				{/* Application ID + Status */}
				<div className="flex items-center gap-3 overflow-hidden">
					<span className="text-mui-text-secondary">{t('info.application_id')}:</span>
					{isLoading ? (
						<Skeleton width={120} height={24} />
					) : (
						<span className="font-bold">{application?.id}</span>
					)}
					{isLoading ? (
						<Skeleton width={80} height={24} />
					) : (
						application?.status !== undefined && <SfiApplicationChip status={application.status} />
					)}
				</div>
				<ApplicationApproveButton />
			</div>
			<div className="border-mui-divider flex flex-col gap-6 rounded-lg">
				{application?.id && (
					<>
						<AdminFlowStep />
						<Divider />
					</>
				)}

				{/* User Info */}
				<div className="flex gap-3">
					<BaseAvatar
						sx={{ width: 40, height: 40, fontSize: '1rem' }}
						name={
							application?.content?.customer_particular?.personal_information?.full_name ||
							application?.user?.email
						}
					/>

					<div className="flex flex-col justify-center gap-1">
						<div className="font-bold">
							{application?.content?.customer_particular?.personal_information?.full_name ||
								application?.content?.tax_compliance_declaration?.customer_name ||
								'_'}
						</div>
						<div className="flex flex-wrap gap-2 text-sm">
							{metaInfo.map((item, index) => (
								<React.Fragment key={item.key}>
									{index > 0 && <Divider orientation="vertical" flexItem />}
									<div className="flex gap-2">
										<span className="text-token-muted-foreground">{item.label}:</span>
										<span>{item.value || '_'}</span>
									</div>
								</React.Fragment>
							))}
						</div>
					</div>
				</div>

				{/* Nav Sections */}
				<AdminApplicationNav applicationId={application?.id} nationality={application?.content?.nationality} />
			</div>
		</div>
	)
}
