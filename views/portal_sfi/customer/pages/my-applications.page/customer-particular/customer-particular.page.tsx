'use client'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { customerApplicationService } from '@/services/customer/applications'
import { CircularProgress } from '@mui/material'
import { SfiTabItem } from '@/components/tab/sfi-tab-default'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import SfiTabButton from '@/components/tab/sfi-tab-button'
import PersonalInformation from '@/views/portal_sfi/customer/components/customer-particular-section/personal-information'
import JobDetails from '@/views/portal_sfi/customer/components/customer-particular-section/job-details'
import BankAccount from '@/views/portal_sfi/customer/components/customer-particular-section/bank-account'
import IdentityVerification from '@/views/portal_sfi/customer/components/customer-particular-section/identity-verification'

function ApplicationCustomerParticularPageView({ id }: { id: string }) {
	const t = useTranslations('customer.customer_particulars')
	const { data: appResponse, isLoading } = useQuery({
		queryKey: customerApplicationService.getApplicationById.key({ id }),
		queryFn: () => customerApplicationService.getApplicationById.get({ id }),
	})

	const application = appResponse?.data?.application

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
					{ label: t('breadcrumb.home'), href: '/my-dashboard' },
					{ label: t('breadcrumb.application_list'), href: '/my-applications' },
					{
						label: t('breadcrumb.application_detail'),
						href: `/my-applications/${id}`,
					},
					{ label: t('breadcrumb.current') },
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

export default ApplicationCustomerParticularPageView
