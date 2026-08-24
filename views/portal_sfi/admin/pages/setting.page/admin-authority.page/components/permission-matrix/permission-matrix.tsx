'use client'

import React, { useMemo } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button as LoadingButton, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { getPermissionConfig } from './permission.config'
import { TPermissionFormValues } from './permission.types'
import { permissionSchema } from './permission.schema'
import { PermissionGroup } from './permission-group'
import { useTranslations } from 'next-intl'

interface PermissionMatrixProps {
  initialPermissions?: string[] | Record<string, boolean>
  isLoading?: boolean
  isUpdating?: boolean
  onSubmit: (data: string[] | Record<string, boolean>) => void
  returnAsArray?: boolean
}

export const PermissionMatrix = ({
  initialPermissions,
  isLoading,
  isUpdating,
  onSubmit,
  returnAsArray = true,
}: PermissionMatrixProps) => {
  const t = useTranslations('admin.settings.authority')
  const defaultValues = useMemo(() => {
    const permissions: Record<string, boolean> = {}
    const config = getPermissionConfig(t)

    config.forEach((group) => {
      group.permissions.forEach((p) => {
        permissions[p.key] = false
      })
    })

    if (Array.isArray(initialPermissions)) {
      initialPermissions.forEach((key) => {
        if (key in permissions) {
          permissions[key] = true
        }
      })
    } else if (initialPermissions && typeof initialPermissions === 'object') {
      Object.entries(initialPermissions).forEach(([key, value]) => {
        if (key in permissions) {
          permissions[key] = !!value
        }
      })
    }

    return { permissions }
  }, [initialPermissions, t])

  const methods = useForm<TPermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = methods

  React.useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const onFormSubmit = (values: TPermissionFormValues) => {
    if (returnAsArray) {
      const activePermissions = Object.entries(values.permissions)
        .filter(([, value]) => value)
        .map(([key]) => key)
      onSubmit(activePermissions)
    } else {
      onSubmit(values.permissions)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex flex-col">
          {errors.permissions?.root && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 border border-red-100 dark:border-red-900/30">
              <Typography
                variant="body2"
                className="text-red-600 dark:text-red-400 font-medium"
              >
                {errors?.permissions?.root?.message}
              </Typography>
            </div>
          )}

          <div className="flex flex-col max-h-[70vh] overflow-y-auto">
            {getPermissionConfig(t).map((group) => (
              <PermissionGroup key={group.key} group={group} />
            ))}
          </div>
        </div>

        <div className="flex justify-start pt-4 border-t border-gray-100 dark:border-gray-800">
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            loading={isUpdating || isLoading}
            disabled={!isDirty && !isUpdating}
          >
            {t('detail.permission.save_changes')}
          </LoadingButton>
        </div>
      </form>
    </FormProvider>
  )
}
