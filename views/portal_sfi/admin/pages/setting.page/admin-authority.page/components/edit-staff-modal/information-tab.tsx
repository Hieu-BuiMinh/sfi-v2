'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  informationTabSchema,
  IInformationTabValues,
} from './information-tab.schema'
import RfhsfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import RfhsfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhsfiDatePicker from '@/components/rhf-inputs/rfh-sfi-date-picker'
import { Button, Button as LoadingButton } from '@mui/material'
import RfhSfiSwitch from '@/components/rhf-inputs/rfh-sfi-switch'
import { TStaffDetail } from '@/services/admin/staffs/staffs-res.dto'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'

interface InformationTabProps {
  staffDetail?: TStaffDetail
  isLoading?: boolean
  isUpdating?: boolean
  onSubmit: (data: IInformationTabValues) => void
  onCancel?: () => void
}

export default function InformationTab({
  staffDetail,
  isLoading,
  isUpdating,
  onSubmit,
  onCancel,
}: InformationTabProps) {
  const t = useTranslations('admin.settings.authority')

  const GENDER_OPTIONS = [
    { label: t('form.add_staff.fields.gender.options.male'), value: 'male' },
    {
      label: t('form.add_staff.fields.gender.options.female'),
      value: 'female',
    },
  ]
  const { control, handleSubmit, reset } = useForm<IInformationTabValues>({
    resolver: zodResolver(informationTabSchema),
    defaultValues: {
      status: true,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      gender: 'female',
      date_of_birth: '',
      nationality: '',
    },
  })

  useEffect(() => {
    if (staffDetail) {
      reset({
        status: staffDetail.status === 1,
        first_name: staffDetail.first_name,
        last_name: staffDetail.last_name,
        email: staffDetail.email,
        phone_number: staffDetail.phone_number,
        gender: staffDetail.employee_profile?.gender as any,
        date_of_birth: staffDetail.employee_profile?.dob
          ? dayjs(staffDetail.employee_profile.dob * 1000).format('YYYY-MM-DD')
          : '',
        nationality: staffDetail.employee_profile?.nationality,
      })
    }
  }, [staffDetail, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex-1 max-h-[60vh] overflow-y-auto overflow-x-hidden p-1 space-y-8">
        {/* Status Switch */}
        <RfhSfiSwitch
          name="status"
          control={control}
          label={t('detail.edit_staff.fields.status')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <RfhsfiTextField
            name="first_name"
            control={control}
            label={t('form.add_staff.fields.first_name.label')}
            placeholder={t('form.add_staff.fields.first_name.placeholder')}
            fullWidth
          />
          <RfhsfiTextField
            name="last_name"
            control={control}
            label={t('form.add_staff.fields.last_name.label')}
            placeholder={t('form.add_staff.fields.last_name.placeholder')}
            fullWidth
          />
          <RfhsfiTextField
            name="email"
            control={control}
            label={t('form.add_staff.fields.email_address.label')}
            placeholder={t('form.add_staff.fields.email_address.placeholder')}
            fullWidth
          />
          <RfhsfiTextField
            name="phone_number"
            control={control}
            label={t('form.add_staff.fields.phone_number.label')}
            placeholder={t('form.add_staff.fields.phone_number.placeholder')}
            fullWidth
          />
          <RfhsfiSingleSelect
            name="gender"
            control={control}
            label={t('form.add_staff.fields.gender.label')}
            options={GENDER_OPTIONS}
          />
          <RfhsfiDatePicker
            name="date_of_birth"
            control={control}
            label={t('form.add_staff.fields.date_of_birth.label')}
          />
          <RfhsfiTextField
            name="nationality"
            control={control}
            label={t('form.add_staff.fields.nationality.label')}
            placeholder={t('form.add_staff.fields.nationality.placeholder')}
            fullWidth
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end items-center pt-6 border-t border-mui-divider mt-8 px-1">
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
