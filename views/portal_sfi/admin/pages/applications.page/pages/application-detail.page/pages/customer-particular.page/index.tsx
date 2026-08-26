/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiTabButton from '@/components/tab/sfi-tab-button'
import { SfiTabItem } from '@/components/tab/sfi-tab-default'
import SfiPageTitle from '@/components/wording/page-title'
import AdminApplicationProvider, {
	useAdminApplication,
} from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import BankAccount from '@/views/portal_sfi/customer/components/customer-particular-section/bank-account'
import IdentityVerification from '@/views/portal_sfi/customer/components/customer-particular-section/identity-verification'
import JobDetails from '@/views/portal_sfi/customer/components/customer-particular-section/job-details'
import PersonalInformation from '@/views/portal_sfi/customer/components/customer-particular-section/personal-information'
import { CircularProgress } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

function AdminApplicationParticularContent({ id }: { id: string }) {
	const t = useTranslations('admin.applications.detail.customer_particulars')
	const tb = useTranslations('admin.applications.detail.breadcrumb')
	const { applicationQuery } = useAdminApplication()
	const { data, isLoading } = applicationQuery
	const application: any = data?.data?.application

	const TABS: SfiTabItem[] = useMemo(
		() => [
			{
				key: 'personal-information',
				label: t('tabs.personal_information'),
				content: <PersonalInformation application={application} t={t} />,
			},
			{
				key: 'job',
				label: t('tabs.job_details'),
				content: <JobDetails application={application} t={t} />,
			},
			{
				key: 'bank-account',
				label: t('tabs.bank_account'),
				content: <BankAccount application={application} t={t} />,
			},
			{
				key: 'identity-verification',
				label: t('tabs.identity_verification'),
				content: <IdentityVerification application={application} t={t} />,
			},
		],
		[application, t]
	)

	if (isLoading) {
		return (
			<div className="flex h-96 w-full items-center justify-center">
				<CircularProgress />
			</div>
		)
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: tb('admin'), href: '/dashboard' },
					{ label: tb('application_list'), href: '/applications' },
					{ label: tb('application_detail'), href: `/applications/${id}` },
					{ label: tb('customer_particular') },
				]}
			/>

			<SfiPageTitle title={t('title')} />

			<div className="border-mui-divider flex flex-col gap-4 rounded-lg border p-6">
				<SfiTabButton
					items={TABS}
					buttonProps={{ variant: 'outlined', size: 'medium' }}
					activeButtonProps={{ variant: 'contained', color: 'primary' }}
					defaultKey="personal-information"
				/>
			</div>
		</div>
	)
}

function AdminApplicationParticularPageView({ id }: { id: string }) {
	return (
		<AdminApplicationProvider id={id}>
			<AdminApplicationParticularContent id={id} />
		</AdminApplicationProvider>
	)
}

export default AdminApplicationParticularPageView
