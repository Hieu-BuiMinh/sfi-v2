import { TPrivyEkycStatus } from '@/services/admin/ekyc'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import FaceRetouchingNaturalRoundedIcon from '@mui/icons-material/FaceRetouchingNaturalRounded'
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Alert, AlertTitle, Button } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import PrivyOverrideModal, { PrivyOverrideAction } from './privy-override-modal'
import PrivyStatusChip from './privy-status-chip'

interface PrivyStatusOverviewProps {
	applicationId: string
	data: TPrivyEkycStatus
	onViewKtp: () => void
	onViewSelfie: () => void
}

export default function PrivyStatusOverview({
	applicationId,
	data,
	onViewKtp,
	onViewSelfie,
}: PrivyStatusOverviewProps) {
	const t = useTranslations('admin.applications.detail.privy_ekyc')
	const [overrideAction, setOverrideAction] = useState<PrivyOverrideAction | null>(null)

	const summary = [
		{ label: t('overview.current_status'), value: <PrivyStatusChip status={data.status} /> },
		{ label: t('overview.privy_id'), value: data.privy_id || '-' },
		{ label: t('overview.reference_id'), value: data.latest_attempt?.id || '-' },
		{ label: t('overview.total_attempts'), value: data.total_attempts.toString() },
	]

	return (
		<section className="border-mui-divider bg-mui-bg-paper overflow-hidden rounded-md border">
			<div className="border-mui-divider flex flex-col justify-between gap-3 border-b px-5 py-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-2.5">
					<div className="bg-mui-primary-alpha/10 flex size-9 items-center justify-center rounded-md">
						<GppGoodRoundedIcon className="text-mui-primary" />
					</div>
					<h2 className="text-base font-bold">{t('overview.title')}</h2>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button
						variant="contained"
						color="success"
						startIcon={<CheckRoundedIcon />}
						onClick={() => setOverrideAction('approve')}
					>
						{t('actions.approve')}
					</Button>
					<Button
						variant="contained"
						color="error"
						startIcon={<CloseRoundedIcon />}
						onClick={() => setOverrideAction('reject')}
					>
						{t('actions.reject')}
					</Button>
				</div>
			</div>

			<div className="p-5">
				<div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
					{summary.map((item) => (
						<div key={item.label} className="min-w-0">
							<p className="text-mui-text-secondary text-xs font-medium">{item.label}</p>
							<div className="mt-2 text-sm font-semibold break-all">{item.value}</div>
						</div>
					))}
				</div>

				{data.reject_reason && data?.status === 'rejected' && (
					<Alert severity="error" className="mt-5">
						<AlertTitle>{t('overview.rejection_reason')}</AlertTitle>
						{data.reject_reason}
					</Alert>
				)}

				<div className="border-mui-divider mt-10">
					<div className="mb-3 flex items-center gap-2">
						<BadgeRoundedIcon className="text-mui-primary" fontSize="small" />
						<h3 className="text-sm font-semibold">{t('documents.title')}</h3>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outlined"
							startIcon={<BadgeRoundedIcon />}
							onClick={onViewKtp}
							disabled={!data.ktp_image}
						>
							{t('documents.view_ktp')}
						</Button>
						<Button
							variant="outlined"
							startIcon={<FaceRetouchingNaturalRoundedIcon />}
							onClick={onViewSelfie}
							disabled={!data.selfie_image}
						>
							{t('documents.view_selfie')}
						</Button>
					</div>
				</div>
			</div>

			{overrideAction && (
				<PrivyOverrideModal
					key={overrideAction}
					action={overrideAction}
					applicationId={applicationId}
					open
					onClose={() => setOverrideAction(null)}
				/>
			)}
		</section>
	)
}
