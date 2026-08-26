'use client'

import SfiCommonModal from '@/components/modals/common-modal'
import RfhSfiNumberInput from '@/components/rhf-inputs/rfh-sfi-number-input'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import { TAdminSettingCurrency, TAdminSettingKey } from '@/services/admin/staffs/admin-setting/admin-setting-req.dto'
import { adminStaffSettingService } from '@/services/admin/staffs/admin-setting'
import toast from '@/utils/toast'
import { formatNumber } from '@/utils/money'
import { Button, Skeleton } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

const CURRENCY_SETTING_KEYS: Record<TAdminSettingCurrency, TAdminSettingKey> = {
	USD: 'usd_minimum_balance',
	IDR: 'idr_minimum_balance',
}

const CURRENCY_OPTIONS = [
	{ value: 'USD', label: 'USD' },
	{ value: 'IDR', label: 'IDR' },
]

interface TMinimumBalanceForm {
	amount: number | undefined
	currency: TAdminSettingCurrency
}

function MinimumBalanceInit() {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const [activeCurrency, setActiveCurrency] = useState<TAdminSettingCurrency>('USD')
	const { control, handleSubmit, reset } = useForm<TMinimumBalanceForm>({
		defaultValues: { amount: undefined, currency: 'USD' },
	})
	const formCurrency = useWatch({ control, name: 'currency' })

	const usdSettingQuery = useQuery({
		queryKey: adminStaffSettingService.getSetting.key(CURRENCY_SETTING_KEYS.USD),
		queryFn: () => adminStaffSettingService.getSetting.get(CURRENCY_SETTING_KEYS.USD),
	})
	const idrSettingQuery = useQuery({
		queryKey: adminStaffSettingService.getSetting.key(CURRENCY_SETTING_KEYS.IDR),
		queryFn: () => adminStaffSettingService.getSetting.get(CURRENCY_SETTING_KEYS.IDR),
	})

	const settings = {
		USD: usdSettingQuery.data?.data,
		IDR: idrSettingQuery.data?.data,
	}
	const activeSetting = settings[activeCurrency]
	const formSetting = settings[formCurrency]

	useEffect(() => {
		if (open && formSetting) {
			reset({ amount: Number(formSetting.value), currency: formCurrency })
		}
	}, [formCurrency, formSetting, open, reset])

	const updateMutation = useMutation({
		mutationFn: ({ amount, currency }: TMinimumBalanceForm) =>
			adminStaffSettingService.update.put({
				key: CURRENCY_SETTING_KEYS[currency],
				old_value: settings[currency]!.value,
				new_value: String(amount),
			}),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: adminStaffSettingService.getSetting.key(CURRENCY_SETTING_KEYS[variables.currency]),
			})
			queryClient.invalidateQueries({ queryKey: adminStaffSettingService.getLogs.key() })
			setActiveCurrency(variables.currency)
			setOpen(false)
			toast.success('Minimum balance updated successfully')
		},
		onError: () => {
			toast.error('Failed to update minimum balance')
		},
	})

	const handleOpen = () => {
		reset({ amount: Number(activeSetting?.value), currency: activeCurrency })
		setOpen(true)
	}

	return (
		<>
			<div className="flex max-w-3xl flex-col gap-4">
				<div className="grid grid-cols-[120px_1fr] items-center border-b py-2">
					<span className="text-mui-text-secondary text-sm">Amount:</span>
					{activeSetting ? (
						<span className="text-sm font-medium">
							{formatNumber(activeSetting.value, { digits: 0 })} {activeCurrency}
						</span>
					) : (
						<Skeleton width={120} />
					)}
				</div>
				<div className="grid grid-cols-[120px_1fr] items-center border-b py-2">
					<span className="text-mui-text-secondary text-sm">Currency:</span>
					<span className="text-sm font-medium">{activeCurrency}</span>
				</div>
				<Button
					variant="contained"
					className="w-fit"
					onClick={handleOpen}
					disabled={!settings.USD || !settings.IDR}
				>
					Change
				</Button>
			</div>

			<SfiCommonModal
				open={open}
				onClose={() => setOpen(false)}
				title="Initial minimum balance change"
				confirmBtn={{
					label: 'Save',
					type: 'submit',
					form: 'minimum-balance-form',
					loading: updateMutation.isPending,
				}}
				cancelBtn={{ label: 'Cancel', disabled: updateMutation.isPending }}
				maxWidth="sm"
			>
				<form
					id="minimum-balance-form"
					onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
					className="flex flex-col gap-5"
				>
					<RfhSfiNumberInput
						name="amount"
						control={control}
						label="Amount"
						thousandSeparator=","
						decimalScale={0}
						allowNegative={false}
						rules={{
							required: 'Amount is required',
							min: { value: 0, message: 'Amount cannot be negative' },
						}}
					/>
					<RfhSfiSingleSelect
						name="currency"
						control={control}
						label="Currency"
						options={CURRENCY_OPTIONS}
						fullWidth
						rules={{ required: 'Currency is required' }}
					/>
				</form>
			</SfiCommonModal>
		</>
	)
}

export default MinimumBalanceInit
