'use client'

import { DEFAULT_ROWS_PER_PAGE_OPTIONS } from '@/constants/components/pagination/pagination.const'
import SfiChipBase from '@/components/chips/chip-base'
import { EmailTemplateCategoryChip, EmailTemplateLanguageChip } from '@/components/chips/email-template-chip'
import { BaseDropdownMenu } from '@/components/menu/base-menu'
import { SfiTable } from '@/components/table'
import { TEmailTemplate } from '@/services/admin/staffs/email-templates/email-templates-res.dto'
import { formatDate } from '@/utils/dayjs'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useEmailTemplatesTableParams } from '../hooks/use-email-templates-table-params'

interface EmailTemplatesTableProps {
	params: ReturnType<typeof useEmailTemplatesTableParams>[0]
	setParams: ReturnType<typeof useEmailTemplatesTableParams>[1]
	rows: TEmailTemplate[]
	total: number
	loading: boolean
}

function EmailTemplatesTable({ params, setParams, rows, total, loading }: EmailTemplatesTableProps) {
	const router = useRouter()
	const columns = useMemo<GridColDef<TEmailTemplate>[]>(
		() => [
			{
				field: 'name',
				headerName: 'Template Name',
				flex: 1,
				minWidth: 260,
				sortable: false,
				renderCell: ({ row }) => (
					<div className="flex min-w-0 flex-col justify-center py-2 leading-tight">
						<span className="truncate leading-5 font-semibold">{row.name}</span>
						<span className="text-mui-primary/70 block truncate text-xs leading-5">{row.slug}</span>
					</div>
				),
			},
			{
				field: 'category',
				headerName: 'Category',
				width: 140,
				sortable: false,
				renderCell: ({ value }) => <EmailTemplateCategoryChip category={value} />,
			},
			{
				field: 'language',
				headerName: 'Language',
				width: 120,
				sortable: false,
				renderCell: ({ value }) => <EmailTemplateLanguageChip language={value} />,
			},
			{
				field: 'subject',
				headerName: 'Subject Line',
				flex: 1,
				minWidth: 300,
				sortable: false,
				renderCell: ({ value }) => <span className="truncate">{value || '—'}</span>,
			},
			{
				field: 'to',
				headerName: 'Recipients (To)',
				flex: 0.7,
				minWidth: 200,
				sortable: false,
				renderCell: ({ value }) =>
					value.length ? (
						<div className="flex min-w-0 gap-1 overflow-hidden p-2">
							{value.map((recipient: string, index: number) => (
								<SfiChipBase
									key={`${recipient}-${index}`}
									label={recipient}
									className="shrink-0 normal-case"
								/>
							))}
						</div>
					) : (
						<span>—</span>
					),
			},
			{
				field: 'updated_at',
				headerName: 'Last Updated',
				width: 170,
				sortable: false,
				valueFormatter: (value: string) => formatDate(value, 'YYYY-MM-DD HH:mm'),
			},
			{
				field: 'actions',
				headerName: 'Actions',
				width: 100,
				sortable: false,
				renderCell: ({ row }) => (
					<BaseDropdownMenu
						renderTrigger={({ onClick }) => (
							<IconButton size="small" onClick={onClick} aria-label="Template actions">
								<MoreVertIcon />
							</IconButton>
						)}
						items={[
							{
								key: 'edit',
								label: 'Edit',
								onClick: () => router.push(`/settings/email-templates/${encodeURIComponent(row.id)}`),
							},
						]}
					/>
				),
			},
		],
		[router]
	)

	return (
		<SfiTable params={params} setParams={setParams} rowCount={total} loading={loading}>
			<SfiTable.Base<TEmailTemplate>
				rows={rows}
				columns={columns}
				rowHeight={64}
				hidePagination
				disableColumnMenu
				sx={{ minHeight: 600 }}
			/>
			<SfiTable.Pagination
				color="primary"
				variant="outlined"
				shape="rounded"
				rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
				showTotalCount
			/>
		</SfiTable>
	)
}

export default EmailTemplatesTable
