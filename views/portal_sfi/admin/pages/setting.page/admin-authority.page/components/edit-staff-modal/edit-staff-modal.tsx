'use client'

import React from 'react'
import SfiCommonModal from '@/components/modals/common-modal'
import SfiTabs from '@/components/tab/sfi-tab-default'
import InformationTab from './information-tab'
import PermissionTab from './permission-tab'
import { IInformationTabValues } from './information-tab.schema'
import { IPermissionTabValues } from './permission-tab.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminStaffsService } from '@/services/admin/staffs'
import { adminUserListService } from '@/services/admin/list/users'
import { adminRolesService } from '@/services/admin/list/roles'
import toast from '@/utils/toast'
import dayjs from 'dayjs'

interface EditStaffModalProps {
  open: boolean
  id: string | null
  onClose: () => void
  onUpdate?: (data: IInformationTabValues) => void
}

export default function EditStaffModal({
  open,
  id,
  onClose,
}: {
  open: boolean
  id: string | null
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const { data: staffDetailResponse, isLoading } = useQuery({
    queryKey: adminStaffsService.getStaffById.key({ id: id || '' }),
    queryFn: () => adminStaffsService.getStaffById.get({ id: id || '' }),
    enabled: !!id && open,
  })

  // Update staff mutation
  const { mutate: updateStaff, isPending: isUpdating } = useMutation({
    mutationFn: adminStaffsService.updateStaff.put,
    onSuccess: (response) => {
      toast.success(response.message || 'Staff updated successfully')
      // Refresh staff list
      queryClient.invalidateQueries({
        queryKey: adminUserListService.getUsersList.key({}),
      })
      onClose()
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Something went wrong')
    },
  })

  // Fetch user roles
  const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
    queryKey: adminRolesService.getUserRoles.key({
      user_id: id || '',
      entity: 'SFI',
    }),
    queryFn: () =>
      adminRolesService.getUserRoles.get({ user_id: id || '', entity: 'SFI' }),
    enabled: !!id && open,
  })

  const handleUpdate = (data: IInformationTabValues) => {
    if (!id || !staffDetailResponse?.data) return

    updateStaff({
      user_id: id,
      first_name: data.first_name,
      last_name: data.last_name,
      status: data.status ? 1 : 0,
      email: data.email,
      phone_number: data.phone_number,
      profile: {
        gender: data.gender,
        date_of_birth: dayjs(data.date_of_birth).unix(),
        nationality: data.nationality,
      },
      corporate_roles: staffDetailResponse.data.corporate_roles,
    })
  }

  const handlePermissionUpdate = (data: IPermissionTabValues) => {
    if (!id || !staffDetailResponse?.data || !rolesResponse?.data) return

    // Transform selected roles back to the numeric index format
    const newCorporateRoles: Record<string, any> = {}
    let roleIndex = 0

    rolesResponse.data.forEach((role) => {
      if (data.roles[role.id]) {
        newCorporateRoles[String(roleIndex)] = {
          name: role.name,
          manager_id: data.managers[role.id] || role.manager?.[0]?.id,
          isAssigned: true,
          label: role.name,
        }
        roleIndex++
      }
    })

    updateStaff({
      user_id: id,
      first_name: staffDetailResponse.data.first_name,
      last_name: staffDetailResponse.data.last_name,
      status: staffDetailResponse.data.status,
      email: staffDetailResponse.data.email,
      phone_number: staffDetailResponse.data.phone_number,
      profile: {
        gender: staffDetailResponse.data.employee_profile?.gender || 'female',
        date_of_birth: staffDetailResponse.data.employee_profile?.dob || 0,
        nationality:
          staffDetailResponse.data.employee_profile?.nationality || '',
      },
      corporate_roles: newCorporateRoles,
    })
  }

  const TABS = [
    {
      key: 'information',
      label: 'Information',
      content: id ? (
        <InformationTab
          staffDetail={staffDetailResponse?.data}
          isLoading={isLoading}
          isUpdating={isUpdating}
          onSubmit={handleUpdate}
          onCancel={onClose}
        />
      ) : null,
    },
    {
      key: 'permission',
      label: 'Permission',
      content: (
        <PermissionTab
          roles={rolesResponse?.data}
          isLoading={isLoadingRoles}
          isUpdating={isUpdating}
          onSubmit={handlePermissionUpdate}
          onCancel={onClose}
        />
      ),
    },
  ]

  return (
    <SfiCommonModal
      open={open}
      onClose={onClose}
      title="Edit Staff"
      maxWidth="md"
      hideCloseButton={false}
    >
      <SfiTabs items={TABS} />
    </SfiCommonModal>
  )
}
