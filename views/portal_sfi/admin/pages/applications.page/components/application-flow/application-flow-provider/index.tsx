/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { adminSfiFlowService } from '@/services/admin/sfi/flow'
import { adminTradingAccountService } from '@/services/admin/trading-accounts'
import { TAtpIdUpdateRes } from '@/services/admin/trading-accounts/trading-account-res.dto'
import { TSfiFlowData, ESfiFlowStatus } from '@/services/admin/sfi/flow/sfi-flow-res.dto'
import { useTranslations } from 'next-intl'
import { useAdminApplication } from '../../application-provider'
import ApprovalConfirmModal from '../modals/approval-confirm-modal'
import RevisionRequestModal from '../modals/revision-request-modal'
import RejectConfirmModal from '../modals/reject-confirm-modal'
import { TApiResponse } from '@/dto/types/api.type'
import toastUtil from '@/utils/toast'
import { toast } from 'sonner'

interface AdminApplicationFlowContextType {
	operationFlowQuery: UseQueryResult<TApiResponse<TSfiFlowData>, Error>
	riskFlowQuery: UseQueryResult<TApiResponse<TSfiFlowData>, Error>
	activeStep: number
	currentFlow?: TSfiFlowData
	currentFlowType: 'OPS' | 'RISK' | 'NONE'
	id: string
	// Action states
	decision: 'approve' | 'revision' | 'reject' | null
	setDecision: (decision: 'approve' | 'revision' | 'reject' | null) => void
	showOperationModal: boolean
	setShowOperationModal: (show: boolean) => void
	isMutationPending: boolean
	handleConfirm: (data: { revision_type?: number[]; revision_message?: string; reject_message?: string }) => void
	etpAccountNumber: string
	setEtpAccountNumber: (value: string) => void
	isEtpValid: boolean
	setIsEtpValid: (valid: boolean) => void
	etpValidationRequest: number
	requestEtpValidation: () => void
	updateAtpIdMutation: UseMutationResult<
		TApiResponse<TAtpIdUpdateRes>,
		any,
		{ application_id: string; atp_id_number: string }
	>
}

const AdminApplicationFlowContext = createContext<AdminApplicationFlowContextType | undefined>(undefined)

export const useAdminApplicationFlow = () => {
	const context = useContext(AdminApplicationFlowContext)
	if (!context) {
		throw new Error('useAdminApplicationFlow must be used within an AdminApplicationFlowProvider')
	}
	return context
}

export function AdminApplicationFlowProvider({ children, id }: { children: React.ReactNode; id: string }) {
	const t = useTranslations('admin.applications.detail.messages')
	const { applicationQuery } = useAdminApplication()
	const application = applicationQuery.data?.data?.application

	const operationFlowQuery = useQuery({
		queryKey: adminSfiFlowService.getOperationFlow.key(id),
		queryFn: () => adminSfiFlowService.getOperationFlow.get(id),
		enabled: !!id,
	})

	const riskFlowQuery = useQuery({
		queryKey: adminSfiFlowService.getRiskFlow.key(id),
		queryFn: () => adminSfiFlowService.getRiskFlow.get(id),
		enabled: !!id,
	})

	const [decision, setDecision] = useState<'approve' | 'revision' | 'reject' | null>('approve')
	const [showOperationModal, setShowOperationModal] = useState(false)
	const [etpAccountNumber, setEtpAccountNumber] = useState('')
	const [isEtpValid, setIsEtpValid] = useState(true)
	const [etpValidationRequest, setEtpValidationRequest] = useState(0)

	useEffect(() => {
		if (application?.binding_accounts?.atp_id_number) {
			setEtpAccountNumber(application.binding_accounts.atp_id_number)
		}
	}, [application?.binding_accounts?.atp_id_number])

	const opsStatus = operationFlowQuery.data?.data?.approve_status
	const riskStatus = riskFlowQuery.data?.data?.approve_status

	const activeStep = useMemo(() => {
		if (opsStatus === null || opsStatus === ESfiFlowStatus.PENDING || opsStatus === ESfiFlowStatus.PROCESSING) {
			return 0
		}
		if (riskStatus === null || riskStatus === ESfiFlowStatus.PENDING || riskStatus === ESfiFlowStatus.PROCESSING) {
			return 1
		}
		return 2
	}, [opsStatus, riskStatus])

	const currentFlowType = useMemo((): 'OPS' | 'RISK' | 'NONE' => {
		if (
			opsStatus === ESfiFlowStatus.REJECT ||
			riskStatus === ESfiFlowStatus.APPROVE ||
			riskStatus === ESfiFlowStatus.REJECT
		) {
			return 'NONE'
		}

		if (opsStatus === ESfiFlowStatus.APPROVE) {
			return 'RISK'
		}

		return 'OPS'
	}, [opsStatus, riskStatus])

	const currentFlow = useMemo(() => {
		if (opsStatus !== null && opsStatus !== ESfiFlowStatus.PROCESSING) {
			return riskFlowQuery.data?.data
		}
		return operationFlowQuery.data?.data
	}, [currentFlowType, operationFlowQuery.data, riskFlowQuery.data])

	const mutation = useMutation({
		mutationFn: adminSfiFlowService.submitOperation.post,
		onSuccess: () => {
			toastUtil.success(t('submit_success'))
			applicationQuery.refetch()
			operationFlowQuery.refetch()
			riskFlowQuery.refetch()
			setDecision(null)
			setShowOperationModal(false)
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || t('submit_error'))
		},
	})

	const updateAtpIdMutation = useMutation({
		mutationFn: adminTradingAccountService.updateAtpId.post,
		onSuccess: () => {
			toastUtil.success(t('update_etp_success'))
			applicationQuery.refetch()
			operationFlowQuery.refetch()
			riskFlowQuery.refetch()
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || t('update_etp_error'))
		},
	})

	const handleConfirm = (data: { revision_type?: number[]; revision_message?: string; reject_message?: string }) => {
		if (!id || !currentFlowType || !decision) return

		const approveStatus =
			decision === 'approve'
				? ESfiFlowStatus.APPROVE
				: decision === 'reject'
					? ESfiFlowStatus.REJECT
					: ESfiFlowStatus.PROCESSING

		mutation.mutate({
			id,
			flowType: currentFlowType === 'OPS' ? 'sfi_operation' : 'sfi_risk',
			data: {
				approve_status: approveStatus,
				...(currentFlowType === 'RISK' && {
					atp_id_number: etpAccountNumber,
				}),
				...data,
			},
		})
	}

	const value = useMemo(
		() => ({
			operationFlowQuery,
			riskFlowQuery,
			activeStep,
			currentFlow,
			currentFlowType,
			id,
			decision,
			setDecision,
			showOperationModal,
			setShowOperationModal,
			isMutationPending: mutation.isPending,
			handleConfirm,
			etpAccountNumber,
			setEtpAccountNumber,
			isEtpValid,
			setIsEtpValid,
			etpValidationRequest,
			requestEtpValidation: () => setEtpValidationRequest((request) => request + 1),
			updateAtpIdMutation,
		}),
		[
			operationFlowQuery,
			riskFlowQuery,
			activeStep,
			currentFlow,
			currentFlowType,
			id,
			decision,
			showOperationModal,
			mutation.isPending,
			etpAccountNumber,
			isEtpValid,
			etpValidationRequest,
			updateAtpIdMutation.isPending,
		]
	)

	return (
		<AdminApplicationFlowContext.Provider value={value}>
			{children}
			<ApprovalConfirmModal
				open={showOperationModal && decision === 'approve'}
				onClose={() => setShowOperationModal(false)}
				onConfirm={handleConfirm}
				isLoading={mutation.isPending}
				flowTitle={currentFlowType}
			/>
			<RevisionRequestModal
				open={showOperationModal && decision === 'revision'}
				onClose={() => setShowOperationModal(false)}
				onConfirm={handleConfirm}
				isLoading={mutation.isPending}
				flowTitle={currentFlowType}
			/>
			<RejectConfirmModal
				open={showOperationModal && decision === 'reject'}
				onClose={() => setShowOperationModal(false)}
				onConfirm={handleConfirm}
				isLoading={mutation.isPending}
				flowTitle={currentFlowType}
			/>
		</AdminApplicationFlowContext.Provider>
	)
}
