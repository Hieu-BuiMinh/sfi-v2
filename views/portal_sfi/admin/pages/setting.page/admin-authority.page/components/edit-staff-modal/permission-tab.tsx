import { TRoleItem } from '@/services/admin/list/roles/roles-res.dto'
import { Button, MenuItem, Skeleton, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IPermissionTabValues,
  permissionTabSchema,
} from './permission-tab.schema'
import { Button as LoadingButton } from '@mui/material'
import { useEffect } from 'react'
import RfhSfiCheckbox from '@/components/rhf-inputs/rfh-sfi-checkbox'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import { useTranslations } from 'next-intl'

interface PermissionTabProps {
  roles?: TRoleItem[]
  isLoading?: boolean
  isUpdating?: boolean
  onSubmit: (data: IPermissionTabValues) => void
  onCancel?: () => void
}

export default function PermissionTab({
  roles,
  isLoading,
  isUpdating,
  onSubmit,
  onCancel,
}: PermissionTabProps) {
  const t = useTranslations('admin.settings.authority')
  const { control, handleSubmit, reset, watch, setValue } =
    useForm<IPermissionTabValues>({
      resolver: zodResolver(permissionTabSchema),
      defaultValues: {
        roles: {},
        managers: {},
      },
    })

  // Sync form when roles are loaded
  useEffect(() => {
    if (roles) {
      const initialRoles: Record<string, boolean> = {}
      const initialManagers: Record<string, string> = {}
      roles.forEach((role) => {
        initialRoles[role.id] = role.isAssigned
        // If assigned, pick the current manager if available
        // Or pick the first available manager if any
        if (role.manager && role.manager.length > 0) {
          initialManagers[role.id] = role.manager[0].id
        }
      })
      reset({ roles: initialRoles, managers: initialManagers })
    }
  }, [roles, reset])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton variant="rectangular" width={24} height={24} />
            <Skeleton variant="text" width={200} height={24} />
          </div>
        ))}
      </div>
    )
  }

  if (!roles || roles.length === 0) {
    return (
      <div className="p-10 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {t('detail.edit_staff.messages.no_roles_found')}
        </p>
      </div>
    )
  }

  const formatRoleName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar p-1 space-y-6">
        <Typography
          variant="subtitle2"
          className="text-gray-500 font-bold uppercase tracking-wider px-2"
        >
          {t('detail.edit_staff.fields.assigned_roles')}
        </Typography>

        <div className="flex flex-col gap-3">
          {roles.map((role) => {
            const isRoleChecked = watch(`roles.${role.id}`)

            return (
              <div
                key={role.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
              >
                {/* Role Checkbox & Name */}
                <RfhSfiCheckbox
                  name={`roles.${role.id}`}
                  control={control}
                  label={
                    <span
                      className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize tracking-tight truncate max-w-[200px] block"
                      title={role.name}
                    >
                      {formatRoleName(role.name)}
                    </span>
                  }
                />

                {/* Manager Select */}
                <div className="flex flex-col gap-1">
                  <RfhSfiSingleSelect
                    name={`managers.${role.id}`}
                    control={control}
                    label={t('detail.edit_staff.fields.manager_label')}
                    disabled={
                      !isRoleChecked ||
                      !role.manager ||
                      role.manager.length === 0
                    }
                    size="small"
                    fullWidth
                  >
                    {role.manager?.map((mgr) => (
                      <MenuItem key={mgr.id} value={mgr.id}>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {mgr.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {mgr.email}
                          </span>
                        </div>
                      </MenuItem>
                    ))}
                  </RfhSfiSingleSelect>
                  {!role.manager || role.manager.length === 0 ? (
                    <span className="text-[10px] text-orange-500 px-1">
                      {t('detail.edit_staff.fields.no_managers_available')}
                    </span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 justify-end items-center pt-6 border-t border-mui-divider mt-8 px-4">
        <Button onClick={onCancel} variant="outlined" className="min-w-[120px]">
          {t('table.actions.cancel')}
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          className="min-w-[120px]"
          loading={isUpdating || isLoading}
        >
          {t('detail.edit_staff.fields.update_button')}
        </LoadingButton>
      </div>
    </form>
  )
}
