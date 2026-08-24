'use client'

import { WithdrawalFormValues } from './withdrawal-form.schema'
import { Button } from '@mui/material'
import { useFormContext } from 'react-hook-form'

interface WithdrawalFormStep2Props {
	onPrevious: () => void
	onSubmit: (data: WithdrawalFormValues) => void
	isSubmitting?: boolean
}

const SummaryRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
	<div className="flex flex-col gap-1">
		<span className="text-mui-text-secondary text-sm">{label}</span>
		<span className="text-base font-medium">{value || '-'}</span>
	</div>
)

const ReviewSection = ({
	title,
	stepNumber,
	children,
}: {
	title: string
	stepNumber: number
	children: React.ReactNode
}) => (
	<section className="space-y-4">
		<div className="flex items-center gap-2">
			<span className="bg-mui-info/30 flex size-10 shrink-0 items-center justify-center rounded-lg font-bold">
				{stepNumber}
			</span>
			<h3 className="text-xl font-semibold">{title}</h3>
		</div>
		<div className="bg-mui-background-paper border-mui-divider grid grid-cols-1 gap-6 rounded-lg border p-4 md:grid-cols-2">
			{children}
		</div>
	</section>
)

function WithdrawalFormStep2({ onPrevious, onSubmit, isSubmitting }: WithdrawalFormStep2Props) {
	const { watch, handleSubmit } = useFormContext<WithdrawalFormValues>()
	const data = watch()

	const formatMoney = (value?: number, currency?: string) => {
		if (value === undefined || value === null) return '-'
		return `${Number(value).toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})} ${currency ?? ''}`.trim()
	}

	const withdrawalAmountDisplay = (() => {
		const primary = formatMoney(data.transferInformation.amount, data.transferInformation.currency)
		const equivalent =
			data.transferInformation.equivalentAmount !== undefined
				? ` ( ${formatMoney(data.transferInformation.equivalentAmount, data.transferInformation.currency === 'USD' ? 'IDR' : 'USD')} )`
				: ''
		return `${primary}${equivalent}`
	})()

	return (
		<div className="space-y-8">
			{/* 1. Customer Information */}
			<ReviewSection title="Customer information" stepNumber={1}>
				<SummaryRow label="Customer name" value={data.customerInformation.customerName} />
				<SummaryRow label="Trading account number" value={data.customerInformation.tradingAccountNumber} />
			</ReviewSection>

			{/* 2. Beneficiary Information */}
			<ReviewSection title="Beneficiary information" stepNumber={2}>
				<SummaryRow label="Beneficiary Bank Name" value={data.beneficiaryInformation.bankName} />
				<SummaryRow label="Beneficiary Name" value={data.beneficiaryInformation.beneficiaryName} />
				<SummaryRow
					label="Beneficiary Account Number"
					value={data.beneficiaryInformation.beneficiaryAccountNumber}
				/>
			</ReviewSection>

			{/* 3. Transfer Information */}
			<ReviewSection title="Transfer information" stepNumber={3}>
				<SummaryRow label="Payment details" value={data.transferInformation.paymentDetails} />
				<SummaryRow label="Withdrawal amount" value={withdrawalAmountDisplay} />
			</ReviewSection>

			{/* Form Actions */}
			<div className="flex justify-end gap-4 pt-4">
				<Button variant="outlined" onClick={onPrevious} color="secondary" disabled={isSubmitting}>
					Previous
				</Button>
				<Button variant="contained" onClick={handleSubmit(onSubmit)} color="primary" loading={isSubmitting}>
					Submit
				</Button>
			</div>
		</div>
	)
}

export default WithdrawalFormStep2
