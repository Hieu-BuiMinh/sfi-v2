'use client'

import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import JsonViewer from './json-viewer'
import { TStaffActivityItem } from '@/services/admin/staffs/staffs-res.dto'
import {
  StaffLogEventChip,
  StaffLogTargetTag,
} from '@/components/chips/staff-log'

export const getStaffLogColumns = (
  t: any
): GridColDef<TStaffActivityItem>[] => [
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
    field: 'actor_id',
    headerName: t('table.columns.actor_id'),
    width: 150,
  },
  {
    field: 'actor_name',
    headerName: t('table.columns.actor_name'),
    width: 200,
    renderCell: (params) => (
      <span className="font-semibold">{params.value || '-'}</span>
    ),
  },
  {
    field: 'actor_roles',
    headerName: t('table.columns.role'),
    width: 200,
    renderCell: (params) => {
      const roles = params.value as string[]
      return roles?.length > 0 ? (
        <span className="text-xs text-gray-500 italic">
          {roles.map((r) => `+ ${r}`).join(' ')}
        </span>
      ) : (
        '-'
      )
    },
  },
  {
    field: 'event',
    headerName: t('table.columns.event'),
    width: 120,
    renderCell: (params) => (
      <StaffLogEventChip event={params.value as string} />
    ),
  },
  {
    field: 'object_id',
    headerName: t('table.columns.object_id'),
    width: 150,
  },
  {
    field: 'target_object',
    headerName: t('table.columns.target'),
    width: 120,
    renderCell: (params) => (
      <StaffLogTargetTag target={params.value as string} />
    ),
  },
  {
    field: 'ip_address',
    headerName: t('table.columns.ip_address'),
    width: 130,
  },
  {
    field: 'timestamp',
    headerName: t('table.columns.timestamp'),
    width: 180,
    renderCell: (params) => (
      <span className="text-gray-500">
        {params.value ? dayjs(params.value).format('YYYY-MM-DD HH:mm:ss') : '-'}
      </span>
    ),
  },
  {
    field: 'old_values',
    headerName: t('table.columns.old_value'),
    width: 300,
    renderCell: (params) => <JsonViewer data={params.value} />,
  },
  {
    field: 'new_values',
    headerName: t('table.columns.new_value'),
    width: 300,
    renderCell: (params) => <JsonViewer data={params.value} />,
  },
]
