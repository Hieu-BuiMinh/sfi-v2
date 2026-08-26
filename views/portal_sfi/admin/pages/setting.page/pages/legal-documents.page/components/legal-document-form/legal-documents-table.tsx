'use client'

import { DEFAULT_ROWS_PER_PAGE_OPTIONS } from '@/constants/components/pagination/pagination.const'
import { BaseDropdownMenu } from '@/components/menu/base-menu'
import { SfiTable } from '@/components/table'
import { TLegalDocumentTemplate } from '@/services/customer/sfi/term-of-use-res.dto'
import { formatDate } from '@/utils/dayjs'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLegalDocumentsTableParams } from '../../hooks/use-legal-documents-table-params'

interface LegalDocumentsTableProps {
	params: ReturnType<typeof useLegalDocumentsTableParams>[0]
	setParams: ReturnType<typeof useLegalDocumentsTableParams>[1]
	rows: TLegalDocumentTemplate[]
	total: number
	loading: boolean
}

function LegalDocumentsTable({ params, setParams, rows, total, loading }: LegalDocumentsTableProps) {
	const router = useRouter()
	const columns = useMemo<GridColDef<TLegalDocumentTemplate>[]>(
		() => [
			{
				field: 'id',
				headerName: 'ID',
				flex: 1,
				minWidth: 260,
				sortable: false,
			},
			{
				field: 'name',
				headerName: 'Name',
				flex: 1,
				minWidth: 260,
				sortable: false,
			},
			{
				field: 'slug',
				headerName: 'Slug',
				flex: 1,
				minWidth: 280,
				sortable: false,
			},
			{
				field: 'updated_at',
				headerName: 'Last Modified at',
				width: 190,
				sortable: false,
				valueFormatter: (value: string) => formatDate(value, 'YYYY-MM-DD'),
			},
			{
				field: 'size',
				headerName: 'Size',
				width: 150,
				sortable: false,
				valueFormatter: (value: string) => `${(Number(value) / 1024).toFixed(2)} KB`,
			},
			{
				field: 'actions',
				headerName: '',
				width: 70,
				sortable: false,
				renderCell: ({ row }) => (
					<BaseDropdownMenu
						renderTrigger={({ onClick }) => (
							<IconButton size="small" onClick={onClick} aria-label="Document actions">
								<MoreVertIcon fontSize="small" />
							</IconButton>
						)}
						items={[
							{
								key: 'view',
								label: 'View',
								onClick: () => router.push(`/settings/legal-documents/${encodeURIComponent(row.slug)}`),
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
			<SfiTable.Base<TLegalDocumentTemplate>
				rows={rows}
				columns={columns}
				getRowId={(row) => row.id}
				hidePagination
				disableColumnMenu
				sx={{ minHeight: 500 }}
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

export default LegalDocumentsTable
