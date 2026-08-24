'use client'

import React from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { SfiTable } from '@/components/table'
import { useTableParams } from '@/hooks/use-table-params'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminFinanceRatesService } from '@/services/admin/finance/rates'
import {
  ERateStatus,
  ERateType,
  TRateItem,
} from '@/services/admin/finance/rates/rates-res.dto'
import {
  TRateType,
  TRateView,
} from '@/services/admin/finance/rates/rates-req.dto'
import dayjs from 'dayjs'
import { DEFAULT_ROWS_PER_PAGE_OPTIONS as PAGINATION_PAGE_SIZE_OPTIONS } from '@/constants/components/pagination/pagination.const'
import RatesStatusChip from '@/components/chips/rate-chip/rate-status-chip'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import toast from '@/utils/toast'
import { BaseDropdownMenu } from '@/components/menu/base-menu'
import { formatNumber } from '@/utils/money'

import { useQueryState } from 'nuqs'
import SfiRadioGroup from '@/components/inputs/sfi-radio-group'
import { useTranslations } from 'next-intl'

interface AdminRatesTabProps {
  type: TRateType
  onEdit: (row: TRateItem) => void
}

function AdminRatesTab({ type, onEdit }: AdminRatesTabProps) {
  const t = useTranslations('admin.rates')
  const [params, setParams] = useTableParams()
  const queryClient = useQueryClient()
  const [view, setView] = useQueryState('view', { defaultValue: 'current' })

  const VIEW_OPTIONS = [
    { label: t('filter.view.current'), value: 'current' },
    { label: t('filter.view.history'), value: 'history' },
  ]

  const mappedType =
    type === 'deposit' ? ERateType.DEPOSIT : ERateType.WITHDRAWAL

  const { data: response, isLoading } = useQuery({
    queryKey: adminFinanceRatesService.getRatesList.key({
      type: mappedType,
      view: view as TRateView,
      page: params.page,
      per_page: params.per_page,
    }),
    queryFn: () =>
      adminFinanceRatesService.getRatesList.get({
        type: mappedType,
        view: view as TRateView,
        page: params.page,
        per_page: params.per_page,
      }),
  })

  const rates = response?.data?.data || []
  const total = response?.data?.total || 0

  const updateStatusMutation = useMutation({
    mutationFn: adminFinanceRatesService.updateRateStatus.patch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get_admin_finance_rates_list'],
      })
      toast.success(t('messages.update_status_success'))
    },
    onError: () => {
      toast.error(t('messages.update_status_error'))
    },
  })

  const columns: GridColDef<TRateItem>[] = [
    {
      field: 'no',
      headerName: t('table.columns.no'),
      width: 70,
      renderCell: (params) => {
        const page = params.api.state.pagination.paginationModel.page ?? 0
        const pageSize =
          params.api.state.pagination.paginationModel.pageSize ?? 10
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id)
        return page * pageSize + index + 1
      },
    },
    {
      field: 'base_currency',
      headerName: t('table.columns.base_currency'),
      width: 130,
    },
    {
      field: 'quote_currency',
      headerName: t('table.columns.quote_currency'),
      width: 130,
    },
    {
      field: 'exchange_rate',
      headerName: t('table.columns.exchange_rate'),
      width: 150,
      renderCell: (params) => (
        <span className="font-bold">
          {formatNumber(params.value as string, {
            digits: 4,
          })}
        </span>
      ),
    },
    {
      field: 'effective_date',
      headerName: t('table.columns.effective_date'),
      width: 150,
      valueFormatter: (value) =>
        value ? dayjs(value * 1000).format('DD/MM/YYYY') : '-',
    },
    {
      field: 'status',
      headerName: t('table.columns.status'),
      width: 120,
      renderCell: (params) => (
        <RatesStatusChip status={params.value as number} />
      ),
    },
    {
      field: 'note',
      headerName: t('table.columns.note'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'action',
      headerName: t('table.columns.action'),
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <ActionMenu
          row={params.row}
          onEdit={onEdit}
          onUpdateStatus={(id, status) =>
            updateStatusMutation.mutate({ id, status })
          }
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/*  */}
      <SfiTable
        params={params}
        setParams={setParams}
        rowCount={total}
        loading={isLoading}
      >
        <div className="flex">
          <SfiRadioGroup
            row
            options={VIEW_OPTIONS}
            value={view || 'current'}
            onChange={(e) => setView(e.target.value)}
          />
        </div>
        <SfiTable.Base<TRateItem>
          rows={rates}
          columns={columns}
          getRowId={(row) => row.id}
          hidePagination
        />
        <SfiTable.Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          rowsPerPageOptions={PAGINATION_PAGE_SIZE_OPTIONS}
          showTotalCount
        />
      </SfiTable>
    </div>
  )
}

function ActionMenu({
  row,
  onEdit,
  onUpdateStatus,
}: {
  row: TRateItem
  onEdit: (row: TRateItem) => void
  onUpdateStatus: (id: string | number, status: ERateStatus) => void
}) {
  const t = useTranslations('admin.rates')
  return (
    <BaseDropdownMenu
      renderTrigger={({ onClick }) => (
        <IconButton
          id={`rate-action-${row.id}`}
          size="small"
          onClick={onClick}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      )}
      items={[
        {
          key: 'edit',
          label: t('table.actions.edit_rate'),
          onClick: () => onEdit(row),
        },
        // {
        //   key: 'status',
        //   label: row.status === ERateStatus.DISABLE ? 'Enable' : 'Disable',
        //   onClick: () =>
        //     onUpdateStatus(
        //       row.id,
        //       row.status === ERateStatus.DISABLE
        //         ? ERateStatus.ENABLE
        //         : ERateStatus.DISABLE
        //     ),
        // },
      ]}
    />
  )
}

export default AdminRatesTab
