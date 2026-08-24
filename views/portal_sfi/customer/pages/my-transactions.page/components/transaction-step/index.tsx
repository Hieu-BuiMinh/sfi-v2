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

function TransactionStep({
  steps,
  activeStep,
  onChange,
}: TransactionStepProps) {
  const currentStep = steps[activeStep]

  return (
    <div className="flex gap-6 flex-col sm:flex-row sm:gap-3">
      {/* left-section */}
      <div className="w-52 flex sm:gap-10 flex-row sm:flex-col max-sm:w-full gap-14 shrink-0">
        {steps.map((step, index) => {
          const isActive = index === activeStep
          const isDisabled = !!step.disabled

          return (
            <div
              key={index}
              className={`flex flex-col gap-0 cursor-pointer transition-colors ${
                isActive ? 'text-mui-primary-main' : 'text-mui-text-secondary'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-mui-primary-light'}`}
              onClick={() => !isDisabled && onChange(index)}
            >
              <span className="text-lg font-normal sm:text-base">
                {step.control.label}
              </span>
              <span className="text-lg font-semibold hidden sm:block">
                {step.control.sublabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* right-section */}
      <div className="flex-1">
        {/* title */}
        <p className="text-lg md:text-2xl font-bold line-clamp-1 mb-4">
          {currentStep?.title}
        </p>
        {/* content */}
        <div className="">{currentStep?.content}</div>
      </div>
    </div>
  )
}

export default TransactionStep
