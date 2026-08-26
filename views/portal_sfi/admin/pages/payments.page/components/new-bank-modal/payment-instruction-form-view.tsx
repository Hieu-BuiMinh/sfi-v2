'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { useQuery } from '@tanstack/react-query'

import { financeBanksService } from '@/services/customer/finance/banks'
import { PaymentMethodItem } from '@/services/customer/finance/payment-methods/payment-methods-res.dto'
import {
	PaymentInstructionFormInput,
	PaymentInstructionFormValues,
	getPaymentInstructionSchema,
} from './payment-instruction.schema'

interface PaymentInstructionFormViewProps {
	data?: PaymentMethodItem
	onSubmit: (values: PaymentInstructionFormValues) => void
	onCancel: () => void
	isLoading?: boolean
}

import { useTranslations } from 'next-intl'
import useProfile from '@/hooks/use-profile'
import { SfiOption } from '@/components/inputs/types'
import { SFI_CURRENCY_OPTIONS } from '@/constants/sfi/currency.const'
import { getBankLogoPath } from '@/utils/bank'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import RfhSfiSwitch from '@/components/rhf-inputs/rfh-sfi-switch'
import { Button } from '@mui/material'
import { SfiEntityId } from '@/dto/enums/entity'

export const PaymentInstructionFormView: React.FC<PaymentInstructionFormViewProps> = ({
	data,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const t = useTranslations('admin.payments.form')
	const { user } = useProfile()

	const ENTITY_OPTIONS: SfiOption[] = [{ label: 'SFI', value: SfiEntityId.SFI }]

	const accountTypeOptions: SfiOption[] = [
		{ label: t('fields.account_type.options.all'), value: '3' },
		{ label: t('fields.account_type.options.individual'), value: '1' },
		{ label: t('fields.account_type.options.corporate'), value: '2' },
	]

	const methodOptions: SfiOption[] = [
		{ label: t('fields.method.options.wire'), value: '1' },
		{ label: t('fields.method.options.domestic'), value: '2' },
	]

	const {
		control,
		handleSubmit,
		watch,
		formState: { isSubmitting },
	} = useForm<PaymentInstructionFormInput, unknown, PaymentInstructionFormValues>({
		resolver: zodResolver(getPaymentInstructionSchema(t)),
		defaultValues: useMemo(() => {
			if (data) {
				return {
					account_type: data.account_type.toString(),
					status: data.status.toString() as '0' | '1',
					currency: data.currency,
					method: data.method,
					bank_id: data.bank_id,
					entity_id: data.entity_id || SfiEntityId.SFI,
					user_id: user?.id || data.user_id,
					beneficiary_account_name: data.beneficiary_account_name,
					beneficiary_account_number: data.beneficiary_account_number,
					beneficiary_bank_branch_name: data.beneficiary_bank_branch_name,
					bank_code: data.bank_code || '',
					beneficiary_bank_address: data.beneficiary_bank_address || '',
					beneficiary_swift_code: data.beneficiary_swift_code || '',
					correspondent_bank_name: data.correspondent_bank_name || '',
					correspondent_account_number: data.correspondent_account_number || '',
					correspondent_swift_code: data.correspondent_swift_code || '',
				}
			}
			return {
				account_type: '1',
				status: '1',
				currency: SFI_CURRENCY_OPTIONS[0].value,
				method: 1,
				bank_id: '',
				entity_id: SfiEntityId.SFI,
				user_id: user?.id || '',
				beneficiary_account_name: '',
				beneficiary_account_number: '',
				beneficiary_bank_branch_name: '',
				bank_code: '',
				beneficiary_bank_address: '',
				beneficiary_swift_code: '',
				correspondent_bank_name: '',
				correspondent_account_number: '',
				correspondent_swift_code: '',
			}
		}, [data, user]),
	})

	// eslint-disable-next-line react-hooks/incompatible-library
	const method = watch('method')

	const { data: bankListResponse, isLoading: isBanksLoading } = useQuery({
		queryKey: financeBanksService.getBanks.key(),
		queryFn: financeBanksService.getBanks.get,
	})

	const bankOptions = useMemo<SfiOption[]>(() => {
		if (!bankListResponse) return []
		return bankListResponse.map((bank) => ({
			label: (
				<div className="flex items-center gap-3">
					<div className="relative h-6 w-6 shrink-0">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={getBankLogoPath(bank.short_name)}
							alt={bank.short_name}
							className="h-full w-full rounded-sm object-contain"
						/>
					</div>
					<span>{bank.name}</span>
				</div>
			),
			value: bank.id,
		}))
	}, [bankListResponse])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<RfhSfiSingleSelect
					name="account_type"
					control={control}
					label={t('fields.account_type.label')}
					options={accountTypeOptions}
					size="large"
				/>
				<RfhSfiSingleSelect
					name="currency"
					control={control}
					label={t('fields.currency')}
					options={SFI_CURRENCY_OPTIONS}
					size="large"
				/>
				<RfhSfiSingleSelect
					name="entity_id"
					control={control}
					label={t('fields.entity')}
					options={ENTITY_OPTIONS}
					size="large"
				/>
				<RfhSfiSingleSelect
					name="method"
					control={control}
					label={t('fields.method.label')}
					options={methodOptions}
					size="large"
				/>
			</div>

			<div className="flex flex-col gap-4">
				<h3 className="border-mui-divider border-b px-1 pb-2 text-lg font-bold">
					{t('sections.beneficiary_info')}
				</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<RfhSfiSingleSelect
						name="bank_id"
						control={control}
						label={t('fields.bank')}
						options={bankOptions}
						containerClassName="md:col-span-2"
						disabled={isBanksLoading}
						size="large"
					/>
					<RfhSfiTextField
						name="beneficiary_account_name"
						control={control}
						label={t('fields.beneficiary_name')}
						placeholder={t('placeholders.beneficiary_name')}
						containerClassName="md:col-span-2"
						size="large"
					/>
					<RfhSfiTextField
						name="beneficiary_account_number"
						control={control}
						label={t('fields.beneficiary_number')}
						placeholder={t('placeholders.beneficiary_number')}
						size="large"
					/>
					<RfhSfiTextField
						name="beneficiary_bank_branch_name"
						control={control}
						label={t('fields.branch')}
						placeholder={t('placeholders.branch')}
						size="large"
					/>
					<RfhSfiTextField
						name="bank_code"
						control={control}
						label={t('fields.bank_code')}
						placeholder={t('placeholders.bank_code')}
						containerClassName="md:col-span-2"
						size="large"
					/>
				</div>

				{Number(method) === 1 && (
					<div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
						<RfhSfiTextField
							name="beneficiary_bank_address"
							control={control}
							label={t('fields.bank_address')}
							placeholder={t('placeholders.bank_address')}
							containerClassName="md:col-span-2"
							size="large"
						/>
						<RfhSfiTextField
							name="beneficiary_swift_code"
							control={control}
							label={t('fields.swift_code')}
							placeholder={t('placeholders.swift_code')}
							size="large"
						/>

						<div className="mt-6 md:col-span-2">
							<h4 className="text-mui-text-secondary border-mui-primary mb-4 border-l-4 pl-3 font-bold">
								{t('sections.intermediary_info')}
							</h4>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<RfhSfiTextField
									name="correspondent_bank_name"
									control={control}
									label={t('fields.intermediary_bank_name')}
									placeholder={t('placeholders.intermediary_bank_name')}
									containerClassName="md:col-span-2"
									size="large"
								/>
								<RfhSfiTextField
									name="correspondent_account_number"
									control={control}
									label={t('fields.intermediary_account')}
									placeholder={t('placeholders.intermediary_account')}
									size="large"
								/>
								<RfhSfiTextField
									name="correspondent_swift_code"
									control={control}
									label={t('fields.intermediary_swift')}
									placeholder={t('placeholders.swift_code')}
									size="large"
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			<div>
				<RfhSfiSwitch name="status" control={control} label={t('fields.activation')} />
			</div>

			<div className="border-mui-divider flex justify-end gap-4 border-t pt-6">
				<Button onClick={onCancel} disabled={isLoading || isSubmitting} variant="outlined">
					{t('actions.cancel')}
				</Button>
				<Button
					type="submit"
					disabled={isLoading || isSubmitting}
					loading={isLoading || isSubmitting}
					variant="contained"
				>
					{t('actions.confirm')}
				</Button>
			</div>
		</form>
	)
}

export default PaymentInstructionFormView
