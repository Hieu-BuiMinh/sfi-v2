'use client'

import React, { useEffect } from 'react'
import SfiCommonModal from '@/components/modals/common-modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { RfhSfiTextField } from '@/components/rhf-inputs/rfh-sfi-textfield'
import { RfhSfiSingleSelect } from '@/components/rhf-inputs/rfh-sfi-single-select'
import { adminTradingAccountService } from '@/services/admin/trading-accounts'
import { adminApplicationService } from '@/services/admin/applications'
import { adminCustomerAccountService } from '@/services/admin/users/customers/accounts'
import toast from '@/utils/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useTranslations } from 'next-intl'

const createSchema = (t: any) =>
  z.object({
    platform: z.string().min(1, t('validation.platform_required')),
    type: z.string().min(1, t('validation.type_required')),
    account_id: z.string().min(1, t('validation.account_id_required')),
    email: z.string().email(t('validation.email_invalid')),
    group: z.string().min(1, t('validation.group_required')),
    binding_account: z.string().optional(),
  })

type FormData = z.infer<ReturnType<typeof createSchema>>

interface BindAccountDialogProps {
  open: boolean
  onClose: () => void
  initialData?: {
    email: string
    applicationId?: string
  }
}

const PLATFORM_OPTIONS = [
  { label: 'MT5', value: 'mt5_alt' },
  { label: 'CQG', value: 'cqg' },
]

export const BindAccountDialog = ({
  open,
  onClose,
  initialData,
}: BindAccountDialogProps) => {
  const t = useTranslations('admin.customers.bind_account')
  const schema = createSchema(t)
  const queryClient = useQueryClient()
  const userEmail = initialData?.email || ''

  const { data: accountsData } = useQuery({
    queryKey: adminCustomerAccountService.getAccountsByType.key(userEmail),
    queryFn: () => adminCustomerAccountService.getAccountsByType.get(userEmail),
    enabled: !!userEmail && open,
  })
  const TYPE_OPTIONS = [
    {
      label: 'Demo',
      value: 'demo',
      disabled: !accountsData?.data?.demo?.length,
    },
    {
      label: 'Live',
      value: 'live',
      disabled: !accountsData?.data?.live?.length,
    },
  ]
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: 'mt5_alt',
      type: 'live',
      account_id: '',
      email: initialData?.email || '',
      group: '',
      binding_account: '',
    },
  })

  const selectedType = watch('type')
  const selectedPlatform = watch('platform')

  const isMT5Live = selectedPlatform === 'mt5_alt' && selectedType === 'live'

  // Consolidated Reset and Auto-fill Logic
  useEffect(() => {
    if (open) {
      let group = ''
      let account_id = ''
      let binding_account = ''
      let finalType = selectedType || 'live'

      const accountsByType = accountsData?.data
      if (accountsByType) {
        // Auto-switch type if the currently selected one is empty but the other is not
        if (
          finalType === 'live' &&
          !accountsByType.live?.length &&
          accountsByType.demo?.length
        ) {
          finalType = 'demo'
        } else if (
          finalType === 'demo' &&
          !accountsByType.demo?.length &&
          accountsByType.live?.length
        ) {
          finalType = 'live'
        }

        const list =
          finalType === 'live' ? accountsByType.live : accountsByType.demo
        const match = list?.[0]

        if (match) {
          group = match.Group || ''
          account_id = match.Login || ''
          binding_account = match.BindingAccount || ''
          clearErrors('group')
        } else {
          setError('group', {
            type: 'manual',
            message: `Can't find ${finalType} group`,
          })
        }
      }

      reset({
        platform: selectedPlatform || 'mt5_alt',
        type: finalType,
        account_id: account_id || '',
        email: userEmail,
        group: group,
        binding_account: binding_account,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accountsData, selectedType, selectedPlatform, reset, userEmail])

  const { mutate, isPending } = useMutation({
    mutationFn: adminTradingAccountService.bindTradingAccount.post,
    onSuccess: (res) => {
      toast.success(res.message || 'Trading account bound successfully')
      if (initialData?.applicationId) {
        queryClient.invalidateQueries({
          queryKey: adminApplicationService.getApplicationById.key(
            initialData.applicationId
          ),
        })
      }
      if (initialData?.email) {
        queryClient.invalidateQueries({
          queryKey: adminCustomerAccountService.getAccountsByType.key(
            initialData.email
          ),
        })
      }
      onClose()
      reset()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to bind account')
    },
  })

  const onSubmit = (data: FormData) => {
    mutate(data)
  }

  const commonT = useTranslations('common.button_text')

  return (
    <SfiCommonModal
      open={open}
      onClose={onClose}
      title={t('title')}
      maxWidth="sm"
      confirmBtn={{
        label: commonT('confirm'),
        loading: isPending,
        onClick: handleSubmit(onSubmit),
      }}
      cancelBtn={{
        label: commonT('cancel'),
      }}
    >
      <div className="flex flex-col gap-4">
        <RfhSfiSingleSelect
          name="platform"
          control={control}
          label={t('fields.platform')}
          options={PLATFORM_OPTIONS}
        />
        <RfhSfiSingleSelect
          name="type"
          control={control}
          label={t('fields.type')}
          options={TYPE_OPTIONS}
        />
        <RfhSfiTextField
          name="account_id"
          control={control}
          label={t('fields.account_id')}
          placeholder={t('placeholders.account_id')}
        />
        <RfhSfiTextField
          name="email"
          control={control}
          label={t('fields.email')}
          disabled
        />
        <RfhSfiTextField
          name="group"
          control={control}
          label={t('fields.group')}
          placeholder={t('placeholders.group')}
          disabled
        />
        {isMT5Live && (
          <RfhSfiTextField
            name="binding_account"
            control={control}
            label={t('fields.binding_account')}
            placeholder={t('placeholders.binding_account')}
          />
        )}
      </div>
    </SfiCommonModal>
  )
}

export default BindAccountDialog
