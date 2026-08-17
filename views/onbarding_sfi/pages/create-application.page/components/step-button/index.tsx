import { cn } from '@/utils/cn'
import { SvgIconProps } from '@mui/material'

export const OnboardStepButton = ({
	active,
	label,
	onClick,
	enable,
	warning,
}: {
	onClick?: () => void
	active?: boolean
	label?: string
	enable?: boolean
	warning?: boolean
}) => {
	const handleClick = () => {
		if (enable && onClick) {
			onClick()
		}
	}
	const CheckIcon = (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="hidden md:block"
		>
			<rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="var(--mui-palette-primary-main)"></rect>
			<rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="var(--mui-palette-primary-main)"></rect>
			<path
				d="M12.4688 5.09375C12.3282 4.95312 12.1095 4.95312 11.9688 5.09375L6.65634 10.25L4.03134 7.67188C3.89071 7.53125 3.67196 7.54687 3.53134 7.67188C3.39071 7.8125 3.40634 8.03125 3.53134 8.17187L6.29696 10.8594C6.39071 10.9531 6.51571 11 6.65634 11C6.79696 11 6.90634 10.9531 7.01571 10.8594L12.4688 5.5625C12.6095 5.45312 12.6095 5.23437 12.4688 5.09375Z"
				// fill="white"
				className="fill-white dark:fill-black"
			></path>
		</svg>
	)
	return (
		<div
			className={cn(
				'flex items-center justify-between rounded-lg border p-3 font-bold transition-all duration-200 md:p-4',

				// Disabled state
				!enable && 'border-mui-divider text-mui-text-disabled cursor-not-allowed opacity-50',
				// Enabled but not active
				enable &&
					!active &&
					'border-mui-divider text-mui-text-secondary hover:text-mui-primary hover:border-mui-primary cursor-pointer',
				// Active state
				active && enable && 'border-mui-primary text-mui-primary cursor-pointer',
				// Warning state
				warning && 'border-mui-warning text-mui-warning'
			)}
			onClick={handleClick}
		>
			{label}
			{warning ? (
				<ApplicationStepWarning className="fill-mui-warning dark:fill-mui-warning-light size-5" />
			) : (
				(active || enable) && CheckIcon
			)}
		</div>
	)
}

const ApplicationStepWarning = (props: SvgIconProps) => {
	return (
		<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="WarningAmberIcon" {...props}>
			<path d="M12 5.99 19.53 19H4.47zM12 2 1 21h22z"></path>
			<path d="M13 16h-2v2h2zm0-6h-2v5h2z"></path>
		</svg>
	)
}
