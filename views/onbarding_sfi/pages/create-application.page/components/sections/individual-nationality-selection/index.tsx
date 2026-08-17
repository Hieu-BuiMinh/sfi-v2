/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import SfiLogo from '@/components/logos/sfi'
import SfiCommonModal from '@/components/modals/common-modal'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { SelectChangeEvent } from '@mui/material'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'

function IndividualNationalitySelection() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const [, setStep] = useQueryState('step', parseAsInteger)
	const [, setSubStep] = useQueryState('subStep')

	const currentNationality = currentIndiApp?.content?.nationality
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [pendingNationality, setPendingNationality] = useState(currentNationality || '')

	const performUpdate = (value: string) => {
		if (!currentIndiApp) return
		updateApplicationMutation.mutate(
			{
				data: {
					...currentIndiApp,
					content: {
						...currentIndiApp.content,
						nationality: value,
					},
				},
			},
			{
				onSuccess: async () => {
					await setStep(0)
					await setSubStep('identity_verification')
				},
			}
		)
	}

	const handleNationalityChange = (e: SelectChangeEvent<unknown>) => {
		const value = e.target.value as string
		if (!currentIndiApp) return

		if (currentNationality && currentNationality !== value) {
			setPendingNationality(value)
			setIsModalOpen(true)
		} else {
			performUpdate(value)
		}
	}

	const handleConfirm = () => {
		performUpdate(pendingNationality)
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
		setPendingNationality('')
	}

	useEffect(() => {
		if (currentIndiApp) {
			setPendingNationality(currentIndiApp?.content?.nationality || '')
		}
	}, [currentIndiApp])

	return (
		<div className="border-mui-divider bg-mui-bg-paper flex flex-col gap-4 rounded-lg border p-10 shadow-sm">
			<SfiLogo className="h-7.5 w-34 dark:hidden" variant="full-positive" />
			<SfiLogo className="hidden h-7.5 w-34 dark:block" variant="full-negative" />

			{
				<>
					<p className="text-xl font-bold">Live trading account application</p>
					<p className="text-mui-text-secondary">
						Get started with real-time trading by completing your application.
					</p>
				</>
			}

			<SfiSingleSelect
				options={[
					{ label: 'Indonesian', value: 'indonesian' },
					{ label: 'Foreigner', value: 'foreigner' },
				]}
				value={currentNationality || ''}
				onChange={handleNationalityChange}
				containerClassName="max-w-96"
				label="Select your Nationality"
			/>

			<SfiCommonModal
				open={isModalOpen}
				onClose={handleCancel}
				title={<div className="w-full text-center">Unsaved changes!</div>}
				cancelBtn={{
					label: 'Cancel',
					onClick: handleCancel,
					disabled: updateApplicationMutation.isPending,
				}}
				confirmBtn={{
					label: 'Continue',
					onClick: handleConfirm,
					disabled: updateApplicationMutation.isPending,
				}}
			>
				Your current customer information has unsaved changes and will be reset. Do you want to proceed?
			</SfiCommonModal>
		</div>
	)
}

export default IndividualNationalitySelection
