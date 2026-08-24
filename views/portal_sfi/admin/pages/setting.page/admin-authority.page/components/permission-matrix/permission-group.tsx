'use client'

import React from 'react'
import { Typography, Divider } from '@mui/material'
import { IPermissionGroup } from './permission.types'
import { useFormContext } from 'react-hook-form'
import RfhSfiCheckbox from '@/components/rhf-inputs/rfh-sfi-checkbox'

interface PermissionRowProps {
  name: string
  label: string
}

const PermissionRow = ({ name, label }: PermissionRowProps) => {
  const { control } = useFormContext()
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-all duration-200">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate pr-2">
        {label}
      </span>
      <RfhSfiCheckbox
        name={name}
        control={control}
        containerClassName="m-0 w-fit"
      />
    </div>
  )
}

interface PermissionGroupProps {
  group: IPermissionGroup
}

export const PermissionGroup = ({ group }: PermissionGroupProps) => {
  return (
    <div className="flex flex-col mb-12 last:mb-0">
      <div className="flex justify-between items-center pb-2">
        <Typography
          variant="subtitle1"
          className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-xs"
        >
          {group.label}
        </Typography>
      </div>
      <Divider />
      <div className="grid grid-cols-1 gap-x-8 gap-y-1 pt-1">
        {group.permissions.map((permission) => (
          <PermissionRow
            key={permission.key}
            name={`permissions.${permission.key}`}
            label={permission.label}
          />
        ))}
      </div>
    </div>
  )
}
