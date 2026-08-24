'use client'

import React, { useMemo, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RfhSfiTextField } from '@/components/rhf-inputs/rfh-sfi-textfield'
import { RhfPhoneInput as RfhSfiPhoneInput } from '@/components/rhf-inputs/rhf-phone-input'
import { RfhSfiSingleAutocomplete } from '@/components/rhf-inputs/rfh-sfi-single-autocomplete'
import { RfhSfiDatePicker } from '@/components/rhf-inputs/rfh-sfi-date-picker'
import { RfhSfiCountrySelect } from '@/components/rhf-inputs/rfh-sfi-country-select'
import { RfhSfiSingleSelect } from '@/components/rhf-inputs/rfh-sfi-single-select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminStaffsService } from '@/services/admin/staffs'
import {
  getStaffFormSchema,
  IStaffFormValues,
  StaffFormProps,
} from './staff-form.types'
import { useTranslations } from 'next-intl'
import { Button, Button as LoadingButton } from '@mui/material'
import toast from '@/utils/toast'
import dayjs from 'dayjs'
import { TCreateStaffRequest } from '@/services/admin/staffs/staffs-req.dto'
import { adminUserListService } from '@/services/admin/list/users'

export function StaffForm({ onSuccess, onCancel }: StaffFormProps) {
  const t = useTranslations('admin.settings.authority')
  const queryClient = useQueryClient()

  const GENDER_OPTIONS = useMemo(
    () => [
      { label: t('form.add_staff.fields.gender.options.male'), value: 'male' },
      {
        label: t('form.add_staff.fields.gender.options.female'),
        value: 'female',
      },
      {
        label: t('form.add_staff.fields.gender.options.other'),
        value: 'other',
      },
    ],
    [t]
  )

  const { control, handleSubmit, setValue } = useForm<IStaffFormValues>({
    resolver: zodResolver(getStaffFormSchema(t)),
    defaultValues: {
      email_address: '',
      first_name: '',
      last_name: '',
      gender: '',
      date_of_birth: '',
      nationality: '',
      phone_number: '',
      position: '',
      location: '',
      department: '',
      manager: undefined,
      manager_id: '',
      manager_email: '',
    },
  })

  // Watchers for dependencies
  const selectedLocationId = useWatch({ control, name: 'location' })
  const selectedDeptId = useWatch({ control, name: 'department' })
  const selectedManagerId = useWatch({ control, name: 'manager' })

  // Fetch Positions
  const { data: positionsResponse, isLoading: isLoadingPositions } = useQuery({
    queryKey: adminStaffsService.getPositions.key(),
    queryFn: () => adminStaffsService.getPositions.get(),
  })

  const positionOptions = useMemo(() => {
    return (
      positionsResponse?.data?.map((p) => ({
        label: p.name,
        value: p.id,
      })) || []
    )
  }, [positionsResponse])

  // Fetch Locations
  const { data: locationsResponse, isLoading: isLoadingLocations } = useQuery({
    queryKey: adminStaffsService.getLocations.key(),
    queryFn: () => adminStaffsService.getLocations.get(),
  })

  const locationOptions = useMemo(() => {
    return (
      locationsResponse?.data?.map((loc) => ({
        label: loc.name,
        value: loc.id,
      })) || []
    )
  }, [locationsResponse])

  // Fetch Departments filtered by location
  const { data: deptsResponse, isLoading: isLoadingDepts } = useQuery({
    queryKey: adminStaffsService.getDepartments.key({
      location: selectedLocationId,
    }),
    queryFn: () =>
      adminStaffsService.getDepartments.get({
        location: selectedLocationId,
      }),
    enabled: !!selectedLocationId,
  })

  const departmentOptions = useMemo(() => {
    return (
      deptsResponse?.data?.map((d) => ({
        label: d.name,
        value: d.id,
      })) || []
    )
  }, [deptsResponse])

  // Fetch Managers filtered by department
  const { data: managersResponse, isLoading: isLoadingManagers } = useQuery({
    queryKey: adminStaffsService.getManagersByDepartment.key({
      department: selectedDeptId,
    }),
    queryFn: () =>
      adminStaffsService.getManagersByDepartment.get({
        department: selectedDeptId,
      }),
    enabled: !!selectedDeptId,
  })

  const managerOptions = useMemo(() => {
    return (
      managersResponse?.data?.map((m) => ({
        label: `${m.name} (${m.email})`,
        value: m.id,
      })) || []
    )
  }, [managersResponse])

  // Sync Manager ID and Email
  const currentManager = useMemo(() => {
    return managersResponse?.data?.find((m) => m.id === selectedManagerId)
  }, [selectedManagerId, managersResponse])

  useEffect(() => {
    if (currentManager) {
      setValue('manager_id', currentManager.id)
      setValue('manager_email', currentManager.email)
    } else {
      setValue('manager_id', '')
      setValue('manager_email', '')
    }
  }, [currentManager, setValue])

  const { mutate, isPending } = useMutation({
    mutationFn: adminStaffsService.createStaff.post,
    onSuccess: (res) => {
      toast.success(res.message || t('messages.create_staff_success'))
      queryClient.invalidateQueries({
        queryKey: adminUserListService.getUsersList.key({}),
      })
      onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('messages.create_staff_error')
      )
    },
  })

  const onSubmit = (data: IStaffFormValues) => {
    const selectedPosition = positionsResponse?.data?.find(
      (p) => p.id === data.position
    )

    const payload: TCreateStaffRequest = {
      first_name: data.first_name,
      last_name: data.last_name,
      department_id: data.department,
      position_slug: selectedPosition?.slug || '',
      manager_id: data.manager || '',
      email: data.email_address,
      phone_number: data.phone_number,
      profile: {
        gender: data.gender,
        date_of_birth: data.date_of_birth
          ? dayjs(data.date_of_birth).unix()
          : 0,
        nationality: data.nationality,
      },
    }

    mutate(payload)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex-1 max-h-[70vh] overflow-y-auto overflow-x-hidden p-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 px-1">
          {/* Left Column */}
          <div className="space-y-6">
            <RfhSfiTextField
              name="email_address"
              control={control}
              label={t('form.add_staff.fields.email_address.label')}
              placeholder={t('form.add_staff.fields.email_address.placeholder')}
              fullWidth
            />
            <RfhSfiTextField
              name="first_name"
              control={control}
              label={t('form.add_staff.fields.first_name.label')}
              placeholder={t('form.add_staff.fields.first_name.placeholder')}
              fullWidth
            />
            <RfhSfiTextField
              name="last_name"
              control={control}
              label={t('form.add_staff.fields.last_name.label')}
              placeholder={t('form.add_staff.fields.last_name.placeholder')}
              fullWidth
            />
            <RfhSfiSingleSelect
              name="gender"
              control={control}
              label={t('form.add_staff.fields.gender.label')}
              options={GENDER_OPTIONS}
              fullWidth
            />
            <RfhSfiDatePicker
              name="date_of_birth"
              control={control}
              label={t('form.add_staff.fields.date_of_birth.label')}
              fullWidth
            />
            <RfhSfiCountrySelect
              name="nationality"
              control={control}
              label={t('form.add_staff.fields.nationality.label')}
              fullWidth
            />
            <RfhSfiPhoneInput
              name="phone_number"
              control={control}
              label={t('form.add_staff.fields.phone_number.label')}
              placeholder={t('form.add_staff.fields.phone_number.placeholder')}
              fullWidth
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <RfhSfiSingleAutocomplete
              name="position"
              control={control}
              label={t('form.add_staff.fields.positions.label')}
              options={positionOptions}
              loading={isLoadingPositions}
              placeholder={t('form.add_staff.fields.positions.placeholder')}
              fullWidth
            />
            <RfhSfiSingleAutocomplete
              name="location"
              control={control}
              label={t('form.add_staff.fields.location.label')}
              options={locationOptions}
              loading={isLoadingLocations}
              placeholder={t('form.add_staff.fields.location.placeholder')}
              fullWidth
              onChange={() => {
                setValue('department', '')
                setValue('manager', undefined)
              }}
            />
            <RfhSfiSingleAutocomplete
              name="department"
              control={control}
              label={t('form.add_staff.fields.department.label')}
              options={departmentOptions}
              loading={isLoadingDepts}
              disabled={!selectedLocationId}
              fullWidth
              placeholder={
                selectedLocationId
                  ? t('form.add_staff.fields.department.placeholder')
                  : t(
                      'form.add_staff.fields.department.placeholder_select_location'
                    )
              }
              onChange={() => {
                setValue('manager', undefined)
              }}
            />
            <RfhSfiSingleAutocomplete
              name="manager"
              control={control}
              label={t('form.add_staff.fields.manager.label')}
              options={managerOptions}
              loading={isLoadingManagers}
              disabled={!selectedDeptId}
              fullWidth
              placeholder={
                selectedDeptId
                  ? t('form.add_staff.fields.manager.placeholder')
                  : t('form.add_staff.fields.manager.placeholder_select_dept')
              }
            />
            <RfhSfiTextField
              name="manager_id"
              control={control}
              label={t('form.add_staff.fields.manager_id.label')}
              disabled
              placeholder={t('form.add_staff.fields.manager_id.placeholder')}
              fullWidth
            />
            <RfhSfiTextField
              name="manager_email"
              control={control}
              label={t('form.add_staff.fields.manager_email.label')}
              disabled
              placeholder={t('form.add_staff.fields.manager_email.placeholder')}
              fullWidth
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-mui-divider mt-8">
        <Button onClick={onCancel} variant="outlined" className="min-w-[120px]">
          {t('table.actions.reset')}
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          className="min-w-[120px]"
          loading={isPending}
        >
          {t('table.actions.view')}
        </LoadingButton>
      </div>
    </form>
  )
}
