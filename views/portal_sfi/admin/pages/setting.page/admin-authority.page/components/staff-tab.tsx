'use client'

import React, { useMemo } from 'react'
import { SfiTable } from '@/components/table'
import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { IconButton, InputAdornment } from '@mui/material'
import { DEFAULT_ROWS_PER_PAGE_OPTIONS as PAGINATION_PAGE_SIZE_OPTIONS } from '@/constants/components/pagination/pagination.const'
import { useTableParams } from '@/hooks/use-table-params'
import { useQuery } from '@tanstack/react-query'
import { adminUserListService } from '@/services/admin/list/users'
import { adminStaffsService } from '@/services/admin/staffs'
import SfiSingleAutocomplete from '@/components/inputs/sfi-single-autocomplete'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import SearchIcon from '@mui/icons-material/Search'
import { TUserListItem } from '@/services/admin/list/users/users-res.dto'
import SfiStaffStatusChip from '@/components/chips/staff-status-chip'
import { BaseDropdownMenu } from '@/components/menu/base-menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { resetTableParams } from '@/hooks/use-table-params'
import SfiCommonModal from '@/components/modals/common-modal'

const formatSlug = (slug: string) => {
  if (!slug) return ''
  return slug
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EditStaffModal } from './edit-staff-modal'

import { StaffForm } from './staff-form'
import { useTranslations } from 'next-intl'

function AdminStaffTab() {
  const t = useTranslations('admin.settings.authority')
  const router = useRouter()
  const [params, setParams] = useTableParams()
  const [openAddStaff, setOpenAddStaff] = React.useState(false)
  const [selectedStaffId, setSelectedStaffId] = React.useState<string | null>(
    null
  )

  const {
    data: usersResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: adminUserListService.getUsersList.key({
      page: params.page || 1,
      perPage: params.per_page || 10,
      department: params.department || undefined,
      location: params.location || undefined,
      search: params.search || undefined,
    }),
    queryFn: () =>
      adminUserListService.getUsersList.get({
        page: params.page || 1,
        perPage: params.per_page || 10,
        department: params.department || undefined,
        location: params.location || undefined,
        search: params.search || undefined,
      }),
  })

  const { data: deptsResponse } = useQuery({
    queryKey: adminStaffsService.getDepartmentsList.key(),
    queryFn: () => adminStaffsService.getDepartmentsList.get(),
  })

  const { data: locationsResponse } = useQuery({
    queryKey: adminStaffsService.getLocations.key(),
    queryFn: () => adminStaffsService.getLocations.get(),
  })

  const departmentOptions = useMemo(() => {
    return (
      deptsResponse?.data?.map((dept) => ({
        label: formatSlug(dept.slug),
        value: dept.id,
      })) || []
    )
  }, [deptsResponse])

  const locationOptions = useMemo(() => {
    return (
      locationsResponse?.data?.map((loc) => ({
        label: loc.name,
        value: loc.slug,
      })) || []
    )
  }, [locationsResponse])

  const users = usersResponse?.data?.data || []
  const total = usersResponse?.data?.total || 0

  const selectedDept = useMemo(() => {
    if (!params.department) return null
    return (
      departmentOptions.find((opt: any) => opt.value === params.department) ||
      null
    )
  }, [params.department, departmentOptions])

  const selectedLocation = useMemo(() => {
    if (!params.location) return null
    return (
      locationOptions.find((opt: any) => opt.value === params.location) || null
    )
  }, [params.location, locationOptions])

  const columns: GridColDef<TUserListItem>[] = [
    {
      field: 'no',
      headerName: t('table.columns.no'),
      width: 100,
      renderCell: (params) => {
        const page = params.api.state.pagination.paginationModel.page ?? 0
        const pageSize =
          params.api.state.pagination.paginationModel.pageSize ?? 10
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id)
        const rowNumber = page * pageSize + index + 1

        return (
          <div className="flex items-center gap-1">
            <BaseDropdownMenu
              renderTrigger={({ onClick }) => (
                <IconButton size="small" onClick={onClick}>
                  <MoreVertIcon />
                </IconButton>
              )}
              items={[
                {
                  key: 'view',
                  label: t('table.actions.view'),
                  // icon: <VisibilityIcon fontSize="small" />,
                  onClick: () => {
                    router.push(`/settings/authority/staff/${params.row.id}`)
                  },
                },
                {
                  key: 'edit',
                  label: t('table.actions.edit'),
                  // icon: <EditIcon fontSize="small" />,
                  onClick: () => {
                    setSelectedStaffId(params.row.id)
                  },
                },
                {
                  key: 'log',
                  label: t('table.actions.view_log'),
                  // icon: <HistoryIcon fontSize="small" />,
                  onClick: () => {
                    router.push(
                      `/settings/authority/staff/${params.row.id}/log`
                    )
                  },
                },
              ]}
            />
            <span>{rowNumber}</span>
          </div>
        )
      },
    },
    {
      field: 'email',
      headerName: t('table.columns.email'),
      width: 250,
      renderCell: (params) => (
        <Link
          href={`/settings/authority/staff/${params.row.id}`}
          className="text-mui-primary-main underline cursor-pointer"
        >
          {params.row.email || '-'}
        </Link>
      ),
    },
    {
      field: 'name',
      headerName: t('table.columns.full_name'),
      width: 200,
      renderCell: (params) => (
        <span className="font-semibold text-mui-text-primary">
          {params.row.name || '-'}
        </span>
      ),
    },
    {
      field: 'position',
      headerName: t('table.columns.position'),
      width: 150,
      valueGetter: (_, row) =>
        row.positions?.map((p) => p.name).join(', ') || '-',
    },
    {
      field: 'department',
      headerName: t('table.columns.department'),
      width: 200,
      valueGetter: (_, row) =>
        row.departments?.map((d) => d.name).join(', ') || '-',
    },
    {
      field: 'phone_number',
      headerName: t('table.columns.phone'),
      width: 150,
      valueGetter: (_, row) => row.phone_number || '-',
    },
    {
      field: 'location',
      headerName: t('table.columns.location'),
      width: 150,
      valueGetter: (_, row) => row.departments?.[0]?.location_id || '-',
    },
    {
      field: 'sale_codes',
      headerName: t('table.columns.sales_code'),
      width: 150,
      valueGetter: (_, row) =>
        row.sale_codes?.map((s) => s.code).join(', ') || '-',
    },
    // {
    //   field: 'referral_link',
    //   headerName: 'Referral link',
    //   width: 150,
    //   valueGetter: () => '-',
    // },
    {
      field: 'status',
      headerName: t('table.columns.status'),
      width: 120,
      renderCell: (params) => <SfiStaffStatusChip status={params.row.status} />,
    },
    {
      field: 'created_at',
      headerName: t('table.columns.created_time'),
      width: 180,
      valueFormatter: (value) =>
        value ? dayjs(value * 1000).format('DD/MM/YYYY HH:mm') : '-',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-full sm:max-w-xs">
          <SfiDebounceTextField
            placeholder={t('filter.search.placeholder')}
            label={t('filter.search.label')}
            size="medium"
            value={params.search || ''}
            onDebounce={(val) =>
              setParams({ search: val ? val : null, page: 1 })
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      fontSize="small"
                      className="text-mui-text-secondary"
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        <div className="w-full sm:max-w-xs">
          <SfiSingleAutocomplete
            label={t('filter.department.label')}
            options={departmentOptions}
            value={selectedDept}
            onChange={(_, newValue) => {
              setParams({ department: newValue?.value || null, page: 1 })
            }}
            size="medium"
          />
        </div>
        <div className="w-full sm:max-w-xs">
          <SfiSingleAutocomplete
            label={t('filter.location.label')}
            options={locationOptions}
            value={selectedLocation}
            onChange={(_, newValue) => {
              setParams({ location: newValue?.value || null, page: 1 })
            }}
            size="medium"
          />
        </div>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => resetTableParams(setParams)}
          size="medium"
        >
          {t('table.actions.reset')}
        </Button>
        <div className="flex-1" />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddStaff(true)}
          size="small"
          className="h-[40px]"
        >
          {t('table.actions.add_staff')}
        </Button>
      </div>

      <SfiTable
        params={{ ...params, per_page: params.per_page }}
        setParams={setParams}
        rowCount={total}
        loading={isLoading}
      >
        <SfiTable.Base
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          hidePagination
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid var(--mui-palette-divider)',
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'var(--mui-palette-background-default)',
              borderBottom: '2px solid var(--mui-palette-divider)',
            },
          }}
        />

        <SfiTable.Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          rowsPerPageOptions={PAGINATION_PAGE_SIZE_OPTIONS}
          showTotalCount
        />
      </SfiTable>

      <SfiCommonModal
        open={openAddStaff}
        onClose={() => setOpenAddStaff(false)}
        title={t('form.add_staff.title')}
        maxWidth="md"
      >
        <StaffForm
          onSuccess={() => {
            setOpenAddStaff(false)
            refetch()
          }}
          onCancel={() => setOpenAddStaff(false)}
        />
      </SfiCommonModal>

      <EditStaffModal
        open={!!selectedStaffId}
        id={selectedStaffId}
        onClose={() => {
          setSelectedStaffId(null)
          refetch()
        }}
      />
    </div>
  )
}

export default AdminStaffTab
