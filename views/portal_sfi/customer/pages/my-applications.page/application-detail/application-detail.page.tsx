'use client'

import BaseAvatar from '@/components/avatar'
import SfiApplicationChip from '@/components/chips/application-chip'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { useAuth } from '@/hooks/use-auth'
import useProfile from '@/hooks/use-profile'
import { customerApplicationService } from '@/services/customer/applications'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Divider, Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React, { useMemo } from 'react'

function CustomerApplicationDetailPageView({ id }: { id: string }) {
	const t = useTranslations('customer.applications_detail')
	const { auth } = useAuth()
	const { user } = useProfile()
	const { data: response, isLoading } = useQuery({
		queryKey: customerApplicationService.getApplicationById.key({ id }),
		queryFn: () => customerApplicationService.getApplicationById.get({ id }),
		enabled: !!id,
	})

	const application = response?.data?.application

	const metaInfo = useMemo(
		() => [
			{ key: 'email', label: t('meta.email'), value: application?.user?.email },
			{
				key: 'trading_number',
				label: t('meta.trading_number'),
				value: application?.binding_accounts?.atp_id_number,
			},
			{
				key: 'product',
				label: t('meta.product'),
				value: application?.application_products?.[0]?.name,
			},
		],
		[application, t]
	)

	const isForeigner = application?.content?.nationality === 'foreigner'

	const sections = useMemo(() => {
		const base = [
			{
				key: 'customer-particular',
				label: t('sections.customer_particulars'),
			},
			{
				key: 'regulation-document',
				label: t('sections.regulation_document'),
			},
		]
		if (isForeigner) {
			base.push({
				key: 'tax-compliance-declaration',
				label: t('sections.tax_compliance_declaration'),
			})
		}
		return base
	}, [t, isForeigner])

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.home'), href: '/my-dashboard' },
					{
						label: t('breadcrumb.application_list'),
						href: '/my-applications',
					},
					{ label: t('breadcrumb.detail') },
				]}
			/>

			<SfiPageTitle title={t('title')} subtitle={t('subtitle')} />

			<div className="border-mui-divider flex flex-col gap-6 rounded-lg border p-6">
				{/* Application ID + Status */}
				<div className="flex items-center gap-3 overflow-hidden">
					<span className="text-mui-text-secondary">{t('info.application_id')}:</span>
					{isLoading ? (
						<Skeleton width={120} height={24} />
					) : (
						<span className="font-bold">{application?.id || id}</span>
					)}
					{isLoading ? (
						<Skeleton width={80} height={24} />
					) : (
						application?.status !== undefined && <SfiApplicationChip status={application.status} />
					)}
				</div>

				{/* User Info */}
				<div className="flex gap-3">
					<BaseAvatar
						sx={{ width: 40, height: 40, fontSize: '1rem' }}
						name={application?.user?.name || user?.name || auth?.name || auth?.email}
					/>

					<div className="flex flex-col justify-center gap-1">
						<div className="font-bold">{application?.user?.name || auth?.name || '...'}</div>
						<div className="flex flex-wrap gap-2 text-sm">
							{metaInfo.map((item, index) => (
								<React.Fragment key={item.key}>
									{index > 0 && <Divider orientation="vertical" flexItem />}
									<div className="flex gap-2">
										<span className="text-token-muted-foreground">{item.label}:</span>
										<span>{item.value || '...'}</span>
									</div>
								</React.Fragment>
							))}
						</div>
					</div>
				</div>

				{/* Nav Sections */}
				<div className="flex flex-col gap-3">
					{sections.map((section) => (
						<Link
							href={`/my-applications/${id}/${section.key}`}
							key={section.key}
							className="bg-token-foreground-alpha/5 dark:bg-mui-bg-paper flex cursor-pointer items-center justify-between rounded-md p-3 text-sm"
						>
							<span>{section.label}</span>
							<ArrowForwardIosIcon fontSize="small" />
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}

export default CustomerApplicationDetailPageView
