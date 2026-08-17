/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Stepper, Step, StepLabel, StepButton, styled, Typography, SvgIconProps } from '@mui/material'

export interface KayyaStep {
	label: string
	description?: string
	icon?: React.ReactNode
	warning?: boolean
}

export interface SfiStepperProps {
	steps: KayyaStep[]
	activeStep: number
	onStepClick?: (stepIndex: number) => void
	orientation?: 'horizontal' | 'vertical'
	alternativeLabel?: boolean
	className?: string
}

const StyledStepper = styled(Stepper)(({ theme }) => ({
	'& .MuiStepConnector-line': {
		borderColor: 'var(--mui-palette-divider)',
	},
	'& .MuiStepIcon-root': {
		// color: 'var(--mui-palette-divider)',
		// border: '2px solid var(--mui-palette-divider)',
		// borderRadius: '50%',
		'&.Mui-active': {
			color: 'var(--mui-palette-primary-main)',
			borderColor: 'var(--mui-palette-primary-main)',
			'& .MuiStepIcon-text': {
				fill: 'var(--mui-palette-primary-contrastText)',
			},
		},
		// '&.Mui-completed': {
		//   color: 'var(--mui-palette-success-main)',
		//   borderColor: 'var(--mui-palette-success-main)',
		// },
	},
	'& .MuiStepIcon-text': {
		fill: 'var(--mui-palette-text-secondary)',
		fontWeight: 'bold',
	},
	'& .MuiStepLabel-label': {
		color: 'var(--mui-palette-text-secondary)',
		'&.Mui-active': {
			color: 'var(--mui-palette-text-primary)',
			fontWeight: '600',
		},
		// '&.Mui-completed': {
		//   color: 'var(--mui-palette-success-main)',
		// },
	},
}))

export const SfiStepper: React.FC<SfiStepperProps> = ({
	steps,
	activeStep,
	onStepClick,
	orientation = 'horizontal',
	alternativeLabel = false,
	className,
	...props
}) => {
	return (
		<StyledStepper
			activeStep={activeStep}
			orientation={orientation}
			alternativeLabel={alternativeLabel}
			className={className}
			{...props}
		>
			{steps.map((step, index) => (
				<Step key={step.label} completed={activeStep > index}>
					<StepButton disableRipple onClick={() => onStepClick?.(index)} disabled={!onStepClick}>
						<StepLabel
							icon={
								step.warning ? (
									<ApplicationStepWarning className="fill-mui-warning dark:fill-mui-warning-light size-6" />
								) : step.icon ? (
									<>{step.icon}</>
								) : undefined
							}
							optional={
								step.description ? <Typography variant="caption">{step.description}</Typography> : null
							}
						>
							{step.label}
						</StepLabel>
					</StepButton>
				</Step>
			))}
		</StyledStepper>
	)
}

export default SfiStepper

const ApplicationStepWarning = (props: SvgIconProps) => {
	return (
		<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="WarningAmberIcon" {...props}>
			<path d="M12 5.99 19.53 19H4.47zM12 2 1 21h22z"></path>
			<path d="M13 16h-2v2h2zm0-6h-2v5h2z"></path>
		</svg>
	)
}
