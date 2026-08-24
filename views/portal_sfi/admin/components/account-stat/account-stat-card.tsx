/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import { formatNumber } from '@/utils/money'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminTradingAccountService } from '@/services/admin/trading-accounts'
import { adminCustomerAccountService } from '@/services/admin/users/customers/accounts'
import { cn } from '@/utils/cn'
import toastUtil from '@/utils/toast'
import BaseDropdownMenu from '@/components/menu/base-menu'
import SfiCommonModal from '@/components/modals/common-modal'

export type AccountStatCardProps = {
	id: string
	email: string
	status: string
	isActive?: boolean
	accountNo: string
	mt5Account: string
	balance: string | number
	equity: string | number
	margin: string | number
	currencySymbol?: string
	onMenuClick?: (event: React.MouseEvent<HTMLElement>) => void
}

export const AccountStatCard = ({
	id,
	email,
	status,
	isActive = true,
	accountNo,
	mt5Account,
	balance,
	equity,
	margin,
	currencySymbol = '$',
}: AccountStatCardProps) => {
	const [showStatusModal, setShowStatusModal] = React.useState(false)
	const queryClient = useQueryClient()

	const statusMutation = useMutation({
		mutationFn: (payload: { status: boolean; email: string }) =>
			adminTradingAccountService.updateTradingAccount.put({
				id,
				payload,
			}),
		onSuccess: () => {
			toastUtil.success(`Account ${isActive ? 'deactivated' : 'activated'} successfully`)
			queryClient.invalidateQueries({
				queryKey: adminCustomerAccountService.getAccountsByType.key(email),
			})
			queryClient.invalidateQueries({
				queryKey: adminTradingAccountService.getTradingAccountList.key({
					email,
				}),
			})
			setShowStatusModal(false)
		},
		onError: (error: any) => {
			toastUtil.success(`Failed to ${isActive ? 'deactivate' : 'activate'} account`)
		},
	})

	const handleUpdateStatus = () => {
		statusMutation.mutate({ status: !isActive, email })
	}

	const containerClasses = cn(
		'w-full rounded-lg border border-mui-divider bg-mui-bg-paper p-4 transition-all',
		!isActive ? 'opacity-80' : 'opacity-100'
	)

	const textPrimaryClasses = cn(
		'text-[14px] font-medium',
		!isActive ? 'text-mui-text-secondary' : 'text-mui-text-primary'
	)

	const labelClasses = cn('text-[13px] leading-5', !isActive ? 'text-mui-text-disabled' : 'text-mui-text-secondary')

	return (
		<>
			<div className={containerClasses}>
				<div className="flex items-start justify-between gap-3">
					<div className="flex min-w-0 items-center gap-3">
						<span
							className={cn(
								'shrink-0 text-[14px] font-bold',
								!isActive ? 'text-mui-text-disabled' : 'text-mui-text-primary'
							)}
						>
							{status}
						</span>
						<span className={cn('truncate', textPrimaryClasses)}>{accountNo}</span>
					</div>

					<BaseDropdownMenu
						renderTrigger={({ onClick }) => (
							<IconButton
								id={`account-menu-${accountNo}`}
								size="small"
								className={cn(
									'shrink-0 -mr-2 -mt-1 hover:bg-mui-action-hover',
									!isActive ? 'text-mui-text-disabled' : 'text-mui-text-secondary'
								)}
								onClick={onClick}
							>
								<MoreVertIcon fontSize="small" />
							</IconButton>
						)}
						items={[
							{
								key: 'status',
								label: isActive ? 'Deactivate account' : 'Activate account',
								onClick: () => setShowStatusModal(true),
							},
						]}
					/>
				</div>

				<div className="mt-4 flex flex-col gap-1.5">
					<div className="flex items-center justify-between gap-4">
						<span className={labelClasses}>MT5 Account</span>
						<span className={textPrimaryClasses}>{mt5Account}</span>
					</div>

					<div className="flex items-center justify-between gap-4">
						<span className={labelClasses}>Balance</span>
						<span className={textPrimaryClasses}>
							{currencySymbol} {formatNumber(balance)}
						</span>
					</div>

					<div className="flex items-center justify-between gap-4">
						<span className={labelClasses}>Equity</span>
						<span className={textPrimaryClasses}>
							{currencySymbol} {formatNumber(equity)}
						</span>
					</div>

					<div className="flex items-center justify-between gap-4">
						<span className={labelClasses}>Margin</span>
						<span className={textPrimaryClasses}>{formatNumber(margin)}</span>
					</div>
				</div>
			</div>
			<SfiCommonModal
				open={showStatusModal}
				onClose={() => setShowStatusModal(false)}
				title={isActive ? 'Deactivate Account' : 'Activate Account'}
				maxWidth="xs"
				confirmBtn={{
					label: 'Confirm',
					color: isActive ? 'error' : 'primary',
					disabled: statusMutation.isPending,
					onClick: handleUpdateStatus,
				}}
				cancelBtn={{
					label: 'Cancel',
				}}
			>
				<div className="text-mui-text-primary text-[14px]">
					Are you sure you want to {isActive ? 'deactivate' : 'activate'} this account?{' '}
					{isActive && 'This action cannot be undone.'}
				</div>
			</SfiCommonModal>
		</>
	)
}
