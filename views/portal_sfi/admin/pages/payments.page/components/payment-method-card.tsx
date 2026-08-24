import {
	PAYMENT_ACCOUNT_TYPE,
	PAYMENT_METHOD_STATUS,
	PAYMENT_METHOD_TYPE,
	PaymentMethodItem,
} from '@/services/customer/finance/payment-methods/payment-methods-res.dto'
import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { IconButton, useColorScheme } from '@mui/material'
import React from 'react'

interface PaymentMethodCardProps {
	data: PaymentMethodItem
	onClick?: (id: string) => void
	onEdit?: (id: string) => void
	onDelete?: (id: string) => void
}

const getBankLogo = (shortName: string) => {
	const path = getBankLogoPath(shortName)

	return path
}

const Tag = ({ children, className }: { children: React.ReactNode; className?: string }) => (
	<span className={cn('rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase', className)}>
		{children}
	</span>
)

import { useTranslations } from 'next-intl'
import { getBankLogoPath } from '@/utils/bank'
import { cn } from '@/utils/cn'
import BaseDropdownMenu from '@/components/menu/base-menu'

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ data, onEdit, onDelete }) => {
	const t = useTranslations('admin.payments.card')
	const tStatus = useTranslations('admin.payments.list.filter.status_options')
	const tMethod = useTranslations('admin.payments.list.filter.method_options')
	const tAccountType = useTranslations('admin.payments.list.filter.account_type_options')
	const { mode } = useColorScheme()
	const {
		id,
		status,
		currency,
		entity,
		method,
		account_type,
		bank,
		beneficiary_account_name,
		beneficiary_account_number,
		beneficiary_bank_branch_name,
		beneficiary_swift_code,
	} = data

	const statusLabel = tStatus(status === PAYMENT_METHOD_STATUS.ACTIVE ? 'active' : 'inactive')

	const methodLabel = tMethod(method === PAYMENT_METHOD_TYPE.WIRE ? 'wire' : 'domestic')

	const accountTypeLabel = tAccountType(account_type === PAYMENT_ACCOUNT_TYPE.INDIVIDUAL ? 'individual' : 'corporate')

	const menuItems = [
		{
			key: 'view',
			label: t('view_edit'),
			onClick: () => onEdit?.(id),
		},
		{
			key: 'delete',
			label: t('delete'),
			color: 'error' as const,
			onClick: () => onDelete?.(id),
		},
	]

	return (
		<div className="border-mui-divider flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-[#11192880]">
			<div className="flex items-center justify-between">
				{/* Header Tags */}
				<div className="flex flex-wrap gap-2">
					<Tag
						className={
							status === PAYMENT_METHOD_STATUS.ACTIVE
								? 'bg-mui-success/10 text-mui-success'
								: 'bg-mui-text-secondary/10 text-mui-text-secondary'
						}
					>
						{statusLabel}
					</Tag>
					<Tag className="bg-mui-info/10 text-mui-info">{currency}</Tag>
					<Tag className="bg-mui-secondary/10 text-mui-secondary dark:bg-mui-primary/10 dark:text-mui-primary">
						{entity?.name || 'SFI'}
					</Tag>
					<Tag className="bg-mui-warning/10 text-mui-warning">{methodLabel}</Tag>
				</div>
				{/* Actions */}
				<BaseDropdownMenu
					renderTrigger={({ onClick }) => (
						<IconButton size="small" onClick={onClick}>
							<MoreVertIcon fontSize="small" />
						</IconButton>
					)}
					items={menuItems}
					className="min-w-37.5"
				/>
			</div>

			{/* Account Type Badge */}
			<div>
				<span className="rounded-full bg-blue-600 px-3 py-1 text-[12px] font-semibold text-white">
					{accountTypeLabel}
				</span>
			</div>

			{/* Bank Info */}
			<div className="flex items-center gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
					<img
						src={getBankLogo(bank?.short_name || '')}
						alt={bank?.short_name}
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="flex flex-col">
					<span className="text-mui-text-primary line-clamp-2 text-sm leading-tight font-semibold">
						{bank?.name || data.free_text_bank || data.bank_code || t('unknown_bank')}
					</span>
					<span className="text-mui-text-secondary text-xs font-medium">{bank?.short_name}</span>
				</div>
			</div>

			{/* Beneficiary Name */}
			<div className="pt-1">
				<span className="text-mui-text-primary text-lg font-bold uppercase">{beneficiary_account_name}</span>
			</div>

			{/* Account Details */}
			<div className="border-mui-divider flex flex-col gap-2 border-t border-dashed pt-2">
				<div className="flex items-center justify-between text-xs">
					<span className="text-mui-text-secondary font-semibold">{t('account_no')}</span>
					<span className="text-mui-text-primary ml-4 truncate font-bold">{beneficiary_account_number}</span>
				</div>

				{beneficiary_bank_branch_name && (
					<div className="flex items-center justify-between text-xs">
						<span className="text-mui-text-secondary font-semibold">{t('branch')}</span>
						<span className="text-mui-text-primary ml-4 truncate font-bold uppercase">
							{beneficiary_bank_branch_name}
						</span>
					</div>
				)}

				{beneficiary_swift_code && (
					<div className="flex items-center justify-between text-xs">
						<span className="text-mui-text-secondary font-semibold">{t('swift')}</span>
						<span className="text-mui-text-primary ml-4 truncate font-bold uppercase">
							{beneficiary_swift_code}
						</span>
					</div>
				)}
			</div>

			{/* Bottom info or button if needed */}
		</div>
	)
}

export default PaymentMethodCard
