import SfiPageTitle from '@/components/wording/page-title'
import { adminEkycService } from '@/services/admin/ekyc'
import toastUtil from '@/utils/toast'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'

interface PrivyPageHeaderProps {
	applicationId: string
	isSyncing: boolean
	onSync: () => void
}

export default function PrivyPageHeader({ applicationId, isSyncing, onSync }: PrivyPageHeaderProps) {
	const t = useTranslations('admin.applications.detail.privy_ekyc')
	const locale = useLocale()
	const resendMutation = useMutation({
		mutationKey: adminEkycService.resendApplicationLink.key(),
		mutationFn: adminEkycService.resendApplicationLink.post,
		onSuccess: (response) => {
			toastUtil.success(response.message)
		},
		onError: () => {
			toastUtil.error(t('resend_error'))
		},
	})

	return (
		<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
			<SfiPageTitle title={t('title')} subtitle={t('subtitle')} showBackButton />

			<div className="flex flex-wrap gap-2 sm:justify-end">
				<Button
					variant="outlined"
					color="warning"
					startIcon={<SendRoundedIcon />}
					onClick={() => resendMutation.mutate({ applicationId, lang: locale })}
					loading={resendMutation.isPending}
				>
					{t('actions.resend')}
				</Button>
				<Button variant="contained" startIcon={<RefreshRoundedIcon />} onClick={onSync} loading={isSyncing}>
					{t('actions.sync')}
				</Button>
			</div>
		</div>
	)
}
