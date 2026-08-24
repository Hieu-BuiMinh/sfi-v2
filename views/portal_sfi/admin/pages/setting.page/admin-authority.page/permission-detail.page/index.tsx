'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import React, { useMemo } from 'react'
import { PermissionMatrix } from '../components/permission-matrix'
import { useMutation, useQuery } from '@tanstack/react-query'
import { adminPermissionsService } from '@/services/admin/permissions'
import toast from '@/utils/toast'
import { Skeleton } from '@mui/material'
import { useTranslations } from 'next-intl'

function PermissionDetailPageView({ id }: { id: string }) {
  const t = useTranslations('admin.settings.authority')
  const {
    data: permissionsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: adminPermissionsService.getPermissions.key({ role: id }),
    queryFn: () => adminPermissionsService.getPermissions.get({ role: id }),
    enabled: !!id,
  })

  const { mutate: updatePermissions, isPending: isUpdating } = useMutation({
    mutationFn: (permissions: string[]) =>
      adminPermissionsService.updatePermissions.put({
        role: id,
        permissions,
      }),
    onSuccess: (res) => {
      if (res?.status === 'success') {
        toast.success(t('messages.update_permission_success'))
        refetch()
      } else {
        toast.error(res?.message || t('messages.update_permission_error'))
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('messages.error_occurred'))
    },
  })

  const permissions = useMemo(() => {
    if (!permissionsResponse?.data) return {}

    const flattened: Record<string, boolean> = {}
    Object.values(permissionsResponse.data).forEach((group) => {
      if (typeof group === 'object' && group !== null) {
        Object.entries(group).forEach(([key, value]) => {
          flattened[key] = !!value
        })
      }
    })
    return flattened
  }, [permissionsResponse])

  const handleSubmit = (values: any) => {
    updatePermissions(values)
  }

  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbSfi
        items={[
          { label: t('breadcrumb.admin'), href: '/dashboard' },
          { label: t('breadcrumb.authority'), href: '/settings/authority' },
          {
            label: t('breadcrumb.permission'),
            href: '/settings/authority/?tab=roles',
          },
          { label: t('breadcrumb.permission_detail') },
        ]}
      />

      <div className="flex flex-col gap-2">
        <SfiPageTitle
          title={t('detail.permission.title')}
          subtitle={t('detail.permission.role_subtitle', { id })}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-1 flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <Skeleton variant="rectangular" height={60} className="rounded" />
          <Skeleton variant="rectangular" height={400} className="rounded" />
          <Skeleton variant="rectangular" height={60} className="rounded" />
        </div>
      ) : (
        <PermissionMatrix
          initialPermissions={permissions}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isUpdating={isUpdating}
        />
      )}
    </div>
  )
}

export default PermissionDetailPageView
