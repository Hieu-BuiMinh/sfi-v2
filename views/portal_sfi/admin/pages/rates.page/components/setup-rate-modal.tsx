'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminFinanceRatesService } from '@/services/admin/finance/rates'
import {
  ERateStatus,
  ERateType,
  TRateItem,
} from '@/services/admin/finance/rates/rates-res.dto'
import { TRateType } from '@/services/admin/finance/rates/rates-req.dto'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiNumberInput from '@/components/rhf-inputs/rfh-sfi-number-input'
import RfhSfiSwitch from '@/components/rhf-inputs/rfh-sfi-switch'

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  // { value: 'VND', label: 'VND' },
  // { value: 'EUR', label: 'EUR' },
  // { value: 'GBP', label: 'GBP' },
  // { value: 'JPY', label: 'JPY' },
  // { value: 'KRW', label: 'KRW' },
  // { value: 'CNY', label: 'CNY' },
  // { value: 'TWD', label: 'TWD' },
  // { value: 'SGD', label: 'SGD' },
  // { value: 'THB', label: 'THB' },
  // { value: 'AUD', label: 'AUD' },
  // { value: 'CAD', label: 'CAD' },
]

const QUOTE_CURRENCY_OPTIONS = [
  { value: 'VND', label: 'VND' },
  { value: 'IDR', label: 'IDR' },
  { value: 'SGD', label: 'SGD' },
  { value: 'CNY', label: 'CNY' },
]
import RfhSfiDatePicker from '@/components/rhf-inputs/rfh-sfi-date-picker'
import toast from '@/utils/toast'
import dayjs from 'dayjs'
import SfiCommonModal from '@/components/modals/common-modal'
import { useTranslations } from 'next-intl'

interface SetupRateModalProps {
  open: boolean
  onClose: () => void
  type: TRateType
  initialData?: TRateItem
}

function SetupRateModal({
  open,
  onClose,
  type,
  initialData,
}: SetupRateModalProps) {
  const t = useTranslations('admin.rates')
  const queryClient = useQueryClient()
  const isEdit = !!initialData
  const mappedType =
    type === 'deposit' ? ERateType.DEPOSIT : ERateType.WITHDRAWAL

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<any>({
    defaultValues: initialData
      ? {
          ...initialData,
          effective_date: dayjs(
            initialData.effective_date * 1000
          ).toISOString(),
          status: initialData.status === ERateStatus.ENABLE,
        }
      : {
          rate_type: mappedType,
          base_currency: 'USD',
          quote_currency: 'IDR',
          exchange_rate: '',
          effective_date: dayjs().toISOString(),
          note: '',
          status: true,
        },
  })

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              ...initialData,
              effective_date: dayjs(
                initialData.effective_date * 1000
              ).toISOString(),
              status: initialData.status === ERateStatus.ENABLE,
            }
          : {
              rate_type: mappedType,
              base_currency: 'USD',
              quote_currency: 'IDR',
              exchange_rate: '',
              effective_date: dayjs().toISOString(),
              note: '',
              status: true,
            }
      )
    }
  }, [open, mappedType, initialData, reset])

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEdit
        ? adminFinanceRatesService.updateRate.put(data)
        : adminFinanceRatesService.createRate.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFinanceRatesService.getRatesList
          .key({
            type: mappedType,
            view: 'current',
          })
          .slice(0, 1),
        exact: false,
      })
      toast.success(
        isEdit
          ? t('messages.update_rate_success')
          : t('messages.create_rate_success')
      )
      onClose()
    },
    onError: () => {
      toast.error(
        isEdit
          ? t('messages.update_rate_error')
          : t('messages.create_rate_error')
      )
    },
  })

  const onSubmit = (data: any) => {
    const body = {
      ...data,
      effective_date: dayjs(data.effective_date).format('YYYY-MM-DD'),
      exchange_rate: Number(data.exchange_rate),
      status: data.status ? ERateStatus.ENABLE : ERateStatus.DISABLE,
    }
    mutation.mutate(body)
  }

  return (
    <SfiCommonModal
      open={open}
      onClose={onClose}
      title={
        isEdit
          ? t('dialog.setup_rate.title.edit')
          : t('dialog.setup_rate.title.create', { type })
      }
      confirmBtn={{
        label: isEdit
          ? t('dialog.setup_rate.actions.update')
          : t('dialog.setup_rate.actions.create'),
        type: 'submit',
        form: 'setup-rate-form',
        loading: isSubmitting || mutation.isPending,
      }}
      cancelBtn={{
        label: t('dialog.setup_rate.actions.cancel'),
      }}
    >
      <form
        id="setup-rate-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-2 gap-5">
          <RfhSfiSingleSelect
            name="base_currency"
            control={control}
            label={t('dialog.setup_rate.fields.base_currency.label')}
            options={CURRENCY_OPTIONS}
            rules={{ required: t('dialog.setup_rate.validation.required') }}
            disabled={isEdit}
          />
          <RfhSfiSingleSelect
            name="quote_currency"
            control={control}
            label={t('dialog.setup_rate.fields.quote_currency.label')}
            options={QUOTE_CURRENCY_OPTIONS}
            rules={{ required: t('dialog.setup_rate.validation.required') }}
            disabled={isEdit}
          />
        </div>
        <RfhSfiNumberInput
          name="exchange_rate"
          control={control}
          label={t('dialog.setup_rate.fields.exchange_rate.label')}
          placeholder={t('dialog.setup_rate.fields.exchange_rate.placeholder')}
          rules={{
            required: t('dialog.setup_rate.validation.required'),
            min: {
              value: 0.0001,
              message: t('dialog.setup_rate.validation.must_be_greater_than_0'),
            },
          }}
          // digits={2}
        />
        <RfhSfiDatePicker
          name="effective_date"
          control={control}
          label={t('dialog.setup_rate.fields.effective_date.label')}
          rules={{ required: t('dialog.setup_rate.validation.required') }}
        />
        <RfhSfiTextField
          name="note"
          control={control}
          label={t('dialog.setup_rate.fields.note.label')}
          placeholder={t('dialog.setup_rate.fields.note.placeholder')}
          multiline
          rows={3}
        />
        <RfhSfiSwitch
          name="status"
          control={control}
          label={t('dialog.setup_rate.fields.status.label')}
        />
      </form>
    </SfiCommonModal>
  )
}

export default SetupRateModal
