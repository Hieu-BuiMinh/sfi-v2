'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import { adminEkycService } from '@/services/admin/ekyc'
import toastUtil from '@/utils/toast'
import AdminApplicationProvider, {
	useAdminApplication,
} from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import { Alert, CircularProgress } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PrivyAttemptHistory from './components/privy-attempt-history'
import PrivyImageModal from './components/privy-image-modal'
import PrivyPageHeader from './components/privy-page-header'
import PrivyStatusOverview from './components/privy-status-overview'

interface PreviewImage {
	title: string
	src: string
}

function PrivyEkycContent({ id }: { id: string }) {
	const t = useTranslations('admin.applications.detail.privy_ekyc')
	const tb = useTranslations('admin.applications.detail.breadcrumb')
	const router = useRouter()
	const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null)
	const { applicationQuery } = useAdminApplication()
	const application = applicationQuery.data?.data?.application
	const isIndonesian = application?.content?.nationality === 'indonesian'

	const statusQuery = useQuery({
		queryKey: adminEkycService.getApplicationStatus.key({ applicationId: id }),
		queryFn: () => adminEkycService.getApplicationStatus.get({ applicationId: id }),
		enabled: Boolean(application && isIndonesian),
	})
	const checkStatusMutation = useMutation({
		mutationKey: adminEkycService.checkApplicationStatus.key(),
		mutationFn: adminEkycService.checkApplicationStatus.post,
		onSuccess: async (response) => {
			await statusQuery.refetch()
			toastUtil.success(response.data.message)
		},
		onError: () => {
			toastUtil.error(t('sync_error'))
		},
	})
	useEffect(() => {
		if (!applicationQuery.isLoading && application && !isIndonesian) {
			router.replace(`/applications/${id}`)
		}
	}, [application, applicationQuery.isLoading, id, isIndonesian, router])

	if (applicationQuery.isLoading || (application && !isIndonesian)) {
		return (
			<div className="flex h-96 w-full items-center justify-center">
				<CircularProgress />
			</div>
		)
	}

	return (
		<div className="flex w-full flex-col gap-5">
			<BreadcrumbSfi
				items={[
					{ label: tb('admin'), href: '/dashboard' },
					{ label: tb('application_list'), href: '/applications' },
					{ label: tb('application_detail'), href: `/applications/${id}` },
					{ label: tb('privy_ekyc') },
				]}
			/>

			<PrivyPageHeader
				applicationId={id}
				isSyncing={checkStatusMutation.isPending || statusQuery.isFetching}
				onSync={() => checkStatusMutation.mutate({ applicationId: id })}
			/>

			{statusQuery.isLoading && (
				<div className="flex h-72 items-center justify-center">
					<CircularProgress />
				</div>
			)}

			{statusQuery.isError && <Alert severity="error">{t('load_error')}</Alert>}

			{statusQuery.data?.data && (
				<>
					<PrivyStatusOverview
						applicationId={id}
						data={statusQuery.data.data}
						onViewKtp={() =>
							setPreviewImage({
								title: t('documents.ktp_title'),
								src: statusQuery.data.data.ktp_image || '',
							})
						}
						onViewSelfie={() =>
							setPreviewImage({
								title: t('documents.selfie_title'),
								src: statusQuery.data.data.selfie_image || '',
							})
						}
					/>
					<PrivyAttemptHistory data={statusQuery.data.data} />
				</>
			)}

			<PrivyImageModal
				open={Boolean(previewImage)}
				title={previewImage?.title || ''}
				image={previewImage?.src || null}
				onClose={() => setPreviewImage(null)}
			/>
		</div>
	)
}

export default function AdminApplicationPrivyEkycPageView({ id }: { id: string }) {
	return (
		<AdminApplicationProvider id={id}>
			<PrivyEkycContent id={id} />
		</AdminApplicationProvider>
	)
}
