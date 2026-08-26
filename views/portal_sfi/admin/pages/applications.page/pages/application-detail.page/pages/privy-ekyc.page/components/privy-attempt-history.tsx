import { TPrivyEkycAttempt, TPrivyEkycStatus } from '@/services/admin/ekyc'
import dayjs from '@/utils/dayjs'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslations } from 'next-intl'
import PrivyStatusChip from './privy-status-chip'

interface PrivyAttemptHistoryProps {
	data: TPrivyEkycStatus
}

export default function PrivyAttemptHistory({ data }: PrivyAttemptHistoryProps) {
	const t = useTranslations('admin.applications.detail.privy_ekyc')
	const attempt = data.latest_attempt
	const columns: GridColDef<TPrivyEkycAttempt>[] = [
		{
			field: 'attempt',
			headerName: t('history.attempt'),
			width: 100,
			renderCell: ({ value }) => `#${value}`,
		},
		{
			field: 'created_at',
			headerName: t('history.date_time'),
			minWidth: 180,
			flex: 1,
			renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
		},
		{
			field: 'id',
			headerName: t('history.reference_id'),
			minWidth: 240,
			flex: 1.3,
			renderCell: ({ value }) => <span className="font-mono text-xs break-all">{value}</span>,
		},
		{
			field: 'status',
			headerName: t('history.status'),
			minWidth: 130,
			flex: 0.7,
			renderCell: () => <PrivyStatusChip status={data.status} />,
		},
		{
			field: 'reject_reason',
			headerName: t('history.reason'),
			minWidth: 220,
			flex: 1.2,
			renderCell: () => <span className="text-red-600 dark:text-red-400">{data.reject_reason || '-'}</span>,
		},
		{
			field: 'processed_by',
			headerName: t('history.processed_by'),
			minWidth: 220,
			flex: 1,
			renderCell: ({ row }) => row.processed_by || row.user_email,
		},
	]

	return (
		<section className="border-mui-divider bg-mui-bg-paper overflow-hidden rounded-md border">
			<div className="border-mui-divider flex items-center gap-2.5 border-b px-5 py-4">
				<div className="bg-mui-primary-alpha/10 flex size-9 items-center justify-center rounded-lg">
					<HistoryRoundedIcon className="text-mui-primary" />
				</div>
				<h2 className="text-base font-bold">{t('history.title')}</h2>
			</div>

			<div className="p-5">
				<DataGrid<TPrivyEkycAttempt>
					rows={attempt ? [attempt] : []}
					columns={columns}
					hideFooter
					disableColumnMenu
					disableColumnSorting
					disableRowSelectionOnClick
					localeText={{ noRowsLabel: t('history.empty') }}
					sx={{ minHeight: 160, border: 0 }}
				/>
			</div>
		</section>
	)
}
