import React from 'react'

export interface ITransactionStep {
	control: {
		label: string
		sublabel: string
	}
	title: string
	content: React.ReactNode
	disabled?: boolean
}

interface TransactionStepProps {
	steps: ITransactionStep[]
	activeStep: number
	onChange: (index: number) => void
}

function TransactionStep({ steps, activeStep, onChange }: TransactionStepProps) {
	const currentStep = steps[activeStep]

	return (
		<div className="flex flex-col gap-6 sm:flex-row sm:gap-3">
			{/* left-section */}
			<div className="flex w-52 shrink-0 flex-row gap-14 max-sm:w-full sm:flex-col sm:gap-10">
				{steps.map((step, index) => {
					const isActive = index === activeStep
					const isDisabled = !!step.disabled

					return (
						<div
							key={index}
							className={`flex cursor-pointer flex-col gap-0 transition-colors ${
								isActive ? 'text-mui-primary' : 'text-mui-text-secondary'
							} ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:text-mui-primary-light'}`}
							onClick={() => !isDisabled && onChange(index)}
						>
							<span className="text-lg font-normal sm:text-base">{step.control.label}</span>
							<span className="hidden text-lg font-semibold sm:block">{step.control.sublabel}</span>
						</div>
					)
				})}
			</div>

			{/* right-section */}
			<div className="flex-1">
				{/* title */}
				<p className="mb-4 line-clamp-1 text-lg font-bold md:text-2xl">{currentStep?.title}</p>
				{/* content */}
				<div className="">{currentStep?.content}</div>
			</div>
		</div>
	)
}

export default TransactionStep
