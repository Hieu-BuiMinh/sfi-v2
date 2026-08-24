/* eslint-disable @next/next/no-img-element */
import { DepositFormValues } from './deposit-form.schema'
import { Button, IconButton, Tooltip } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { ContentCopy } from '@mui/icons-material'
import RfhFileUpload from '@/components/rhf-inputs/rhf-file-upload'
import toastUtil from '@/utils/toast'

interface DepositFormStep2Props {
	onPrevious: () => void
	onSubmit: (data: DepositFormValues) => void
	isSubmitting?: boolean
}

const SummaryRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
	<div className="flex flex-col gap-1">
		<span className="text-mui-text-secondary text-sm">{label}</span>
		<span className="text-base font-medium">{value || '-'}</span>
	</div>
)

const SummaryRowWithCopy = ({ label, value }: { label: string; value: string }) => {
	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation()
		navigator.clipboard.writeText(value)
		toastUtil.success(`${label} copied to clipboard`)
	}

	return (
		<div className="flex flex-col gap-1">
			<span className="text-mui-text-secondary text-sm">{label}</span>
			<div className="group flex items-center gap-2">
				<span className="text-base font-medium">{value || '-'}</span>
				{value && (
					<Tooltip title="Copy">
						<IconButton size="small" onClick={handleCopy} className="transition-opacity">
							<ContentCopy fontSize="inherit" />
						</IconButton>
					</Tooltip>
				)}
			</div>
		</div>
	)
}

const ReviewSection = ({
	title,
	stepNumber,
	children,
	className,
}: {
	title: string
	stepNumber: number
	children: React.ReactNode
	className?: string
}) => (
	<section className="space-y-4">
		<div className="flex items-center gap-2">
			<span className="bg-mui-info/30 flex size-10 shrink-0 items-center justify-center rounded-lg font-bold">
				{stepNumber}
			</span>
			<h3 className="text-xl font-semibold">{title}</h3>
		</div>
		<div
			className={`bg-mui-background-paper border-mui-divider grid grid-cols-1 gap-6 rounded-lg border p-4 md:grid-cols-2 ${className}`}
		>
			{children}
		</div>
	</section>
)

function DepositFormStep2({ onPrevious, onSubmit, isSubmitting }: DepositFormStep2Props) {
	const { watch, handleSubmit, control } = useFormContext<DepositFormValues>()
	const data = watch()

	const formatMoney = (value?: number, currency?: string) => {
		if (value === undefined || value === null) return '-'
		return `${Number(value).toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})} ${currency ?? ''}`.trim()
	}

	return (
		<div className="space-y-8">
			{/* 1. Customer Information */}
			<ReviewSection title="Customer information" stepNumber={1}>
				<SummaryRow label="Customer name" value={data.customerInformation.customerName} />
				<SummaryRow label="Trading account number" value={data.customerInformation.tradingAccountNumber} />
			</ReviewSection>

			{/* 2. Beneficiary Information */}
			<ReviewSection title="Beneficiary information" stepNumber={2}>
				<SummaryRow label="Beneficiary Bank" value={data.beneficiaryInformation.beneficiaryBankLabel} />
				<SummaryRowWithCopy label="Beneficiary Name" value={data.beneficiaryInformation.beneficiaryName} />
				<SummaryRowWithCopy
					label="Beneficiary Account Number"
					value={data.beneficiaryInformation.beneficiaryAccountNumber}
				/>
				<SummaryRow label="Bank Code" value={data.beneficiaryInformation.bankCode} />
				<SummaryRow label="Swift Code" value={data.beneficiaryInformation.swiftCode} />
			</ReviewSection>

			{/* 3. Transfer Instructions */}
			<ReviewSection title="Transfer instructions" stepNumber={3}>
				<SummaryRow
					label="Deposit amount"
					value={formatMoney(data.transferInstructions.amount, data.transferInstructions.currency)}
				/>
				<SummaryRow label="Payment details" value={data.transferInstructions.paymentDetails} />
			</ReviewSection>

			{/* 4. Proof of Deposit */}
			<ReviewSection title="Proof of Deposit (POD)" stepNumber={4} className="md:grid-cols-1">
				<div className="space-y-4">
					<p className="text-mui-text-secondary text-sm">
						Upload screenshot of the bank transaction. Supported files: .png, .jpg, .jpeg. Maximum size:
						10MB.
					</p>
					<RfhFileUpload
						name="proofOfDeposit"
						control={control}
						// label="Proof of Deposit"
						accept={{
							'image/png': ['.png'],
							'image/jpeg': ['.jpg', '.jpeg'],
						}}
						maxSize={10 * 1024 * 1024}
					>
						{({ open, preview, removePreview }) => (
							<div className="flex items-center gap-4">
								{preview && (
									<div className="border-mui-divider relative size-16 shrink-0 overflow-hidden rounded-lg border">
										<img src={preview} alt="POD Preview" className="size-full object-cover" />
										<IconButton
											onClick={(e) => {
												e.stopPropagation()
												removePreview()
											}}
											size="small"
											className="absolute top-0.5 right-0.5 bg-black/50 p-0.5 text-white hover:bg-black/70"
										>
											<svg
												width="12"
												height="12"
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M12 4L4 12M4 4L12 12"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
												/>
											</svg>
										</IconButton>
									</div>
								)}
								<Button
									variant="outlined"
									onClick={open}
									className="border-mui-divider text-mui-text-primary hover:border-mui-primary-main h-10"
									sx={{ borderRadius: '8px', textTransform: 'none' }}
								>
									{preview ? 'Change Proof' : 'Upload Proof'}
								</Button>
							</div>
						)}
					</RfhFileUpload>
				</div>
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

export default DepositFormStep2
