/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { OnboardIcon } from '@/components/icons/onboard-icon'
import SfiCommonModal from '@/components/modals/common-modal'
import { APPLICATION_STATUS } from '@/dto/enums/application'
import useProfile from '@/hooks/use-profile'
import { TApplication } from '@/services/admin/applications/applications-res.dto'
import { toastUtil } from '@/utils/toast'
import { getAppConfig } from '@/utils/get-app-config'
import { Button } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCustomerApplication } from '../../components/customer-application-provider'
import RegisterAccountTypeSelector from './components/register-account-type-selector'

function OnboardingRegisterPageView() {
	const config = getAppConfig()
	const router = useRouter()
	const { isLoading: loadingProfile } = useProfile()
	const {
		applicationsQuery,
		createApplicationMutation,
		deleteApplicationMutation,
		currentIndiApp,
		currentCorpApp,
	} = useCustomerApplication()

	const [selectedType, setSelectedType] = useState('individual')
	const [openModal, setOpenModal] = useState(false)
	const [isDeletingDrafts, setIsDeletingDrafts] = useState(false)

	const loadingApps = applicationsQuery.isLoading
	const applications = applicationsQuery.data?.data || []

	const getStatus = (app?: TApplication) => ({
		latest: app,
		isContinue: app?.status === APPLICATION_STATUS.STATUS_NOT_STARTED,
		isRegistered: app?.status === APPLICATION_STATUS.STATUS_APPROVE,
		isRejected: app?.status === APPLICATION_STATUS.STATUS_REJECT,
		isProcessing:
			app?.status === APPLICATION_STATUS.STATUS_FILLING ||
			app?.status === APPLICATION_STATUS.STATUS_PROCESSING,
	})

	const appStats = {
		individual: getStatus(currentIndiApp),
		corporate: getStatus(currentCorpApp),
		allDrafts: applications.filter(
			(item: TApplication) => item.status === APPLICATION_STATUS.STATUS_NOT_STARTED
		),
	}

	const currentStatus = selectedType === 'individual' ? appStats.individual : appStats.corporate

	const handleCreateApplication = async () => {
		try {
			const res = await createApplicationMutation.mutateAsync({
				type: selectedType,
				slug: 'nano_contracts_sfi',
			})
			const appId = res?.data?.[0]?.id
			if (appId) {
				router.push(`/create-application/${selectedType}`)
			} else {
				toastUtil.error('Failed to create application')
			}
		} catch (error: any) {
			toastUtil.error(
				error?.response?.data?.message || error?.message || 'Error occurred while creating application'
			)
		}
	}

	const handleSubmit = async () => {
		if (selectedType === 'corporate') {
			handleContinue()
			return
		}

		if (currentStatus.isContinue) {
			setOpenModal(true)
		} else if (currentStatus.latest?.id) {
			handleContinue()
		} else {
			await handleCreateApplication()
		}
	}

	const handleStartOver = async () => {
		if (isDeletingDrafts || createApplicationMutation.isPending) return
		try {
			setIsDeletingDrafts(true)
			if (appStats.allDrafts.length > 0) {
				await Promise.all(
					appStats.allDrafts.map((draft: TApplication) =>
						deleteApplicationMutation.mutateAsync({ id: draft.id })
					)
				)
			}
			setOpenModal(false)
			await handleCreateApplication()
		} catch (error: any) {
			toastUtil.error(error?.response?.data?.message || error?.message || 'Failed to delete ongoing draft')
		} finally {
			setIsDeletingDrafts(false)
		}
	}

	const handleContinue = () => {
		router.push(`/create-application/${selectedType}`)
	}

	const accountTypes = [
		{
			id: 'individual',
			title: 'Individuals',
			description: 'Suited for individuals managing personal finances or investments with simple needs.',
			icon: <OnboardIcon.IndividualSelector className="text-[46px]" fontSize="large" />,
			stats: appStats.individual,
		},
		{
			id: 'corporate',
			title: 'Corporate',
			description:
				'Designed for companies and institutions to manage large-scale financial activities or investments',
			icon: <OnboardIcon.CooperateSelector className="text-[46px]" fontSize="large" />,
			stats: appStats.corporate,
		},
	]

	const getButtonLabel = () => {
		switch (true) {
			case currentStatus.isRegistered:
			case currentStatus.isProcessing:
			case currentStatus.isRejected:
				return 'View Application'
			case currentStatus.isContinue:
				return 'Continue'

			default:
				return 'Start Application'
		}
	}

	const isLoading = createApplicationMutation.isPending || isDeletingDrafts || loadingApps || loadingProfile

	return (
		<div className="flex h-[calc(100vh-8rem)] items-center justify-center p-4">
			<div className="flex w-full max-w-227.5 flex-col gap-8">
				{/* Demo Account Banner */}
				<div className="bg-mui-bg-paper border-mui-primary/50 flex flex-col items-center justify-between gap-4 rounded-xl border p-3 md:flex-row">
					<div className="text-mui-text-primary text-sm tracking-tight md:text-base">
						Experience the nano contracts trading with our{' '}
						<span className="text-mui-primary font-bold">demo account.</span>
					</div>
					<Button
						variant="contained"
						component="a"
						href={config?.pages?.trading_page || '#'}
						target="_blank"
						rel="noopener noreferrer"
						endIcon={<ArrowRight className="h-4 w-4" />}
						className="bg-mui-primary min-w-30 whitespace-nowrap normal-case shadow-none hover:shadow-md"
					>
						Try demo
					</Button>
				</div>

				<div className="mx-auto flex max-w-125 flex-col gap-3 text-center">
					<p className="text-mui-text-primary text-3xl font-bold">Your trading account type</p>
					<p className="text-mui-text-secondary text-base">
						Selecting the account type that matches your needs
					</p>
				</div>
				<div className="mx-auto flex max-w-125 flex-col gap-4">
					{accountTypes.map((type) => (
						<RegisterAccountTypeSelector
							key={type.id}
							title={type.title}
							description={type.description}
							icon={type.icon}
							active={selectedType === type.id}
							onClick={() => setSelectedType(type.id)}
							registered={type.stats.isRegistered}
							isContinue={type.stats.isContinue}
							isProcessing={type.stats.isProcessing}
						/>
					))}
				</div>

				<div className="flex w-full justify-center">
					<Button
						className="w-full max-w-125"
						size="large"
						variant="contained"
						onClick={handleSubmit}
						disabled={isLoading || loadingProfile || loadingApps}
						loading={isLoading}
					>
						{getButtonLabel()}
					</Button>
				</div>
			</div>

			<SfiCommonModal
				open={openModal}
				onClose={() => setOpenModal(false)}
				title={<div className="w-full text-center">Continue Application</div>}
				cancelBtn={{
					label: 'Start Over',
					onClick: handleStartOver,
					disabled: isDeletingDrafts || createApplicationMutation.isPending,
				}}
				confirmBtn={{
					label: 'Continue',
					onClick: handleContinue,
					disabled: isDeletingDrafts || createApplicationMutation.isPending,
				}}
			>
				<div className="text-center">You have an ongoing application. Would you like to proceed?</div>
			</SfiCommonModal>
		</div>
	)
}

export default OnboardingRegisterPageView
