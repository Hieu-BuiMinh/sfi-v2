import { cn } from '@/utils/cn'
import CloseIcon from '@mui/icons-material/Close'
import { Button, ButtonProps, IconButton, Modal, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface SfiCommonModalProps {
	open: boolean
	onClose: () => void
	title?: ReactNode
	children?: ReactNode
	footer?: ReactNode
	confirmBtn?: ButtonProps & { label?: ReactNode }
	cancelBtn?: ButtonProps & { label?: ReactNode }
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	className?: string
	contentClassName?: string
	titleClassName?: string
	footerClassName?: string
	hideCloseButton?: boolean
}

const maxWidthMap = {
	xs: 'max-w-[400px]',
	sm: 'max-w-[500px]',
	md: 'max-w-[700px]',
	lg: 'max-w-[900px]',
	xl: 'max-w-[1200px]',
}

function SfiCommonModal({
	open,
	onClose,
	title,
	children,
	footer,
	confirmBtn,
	cancelBtn,
	maxWidth = 'sm',
	className,
	contentClassName,
	titleClassName,
	footerClassName,
	hideCloseButton = false,
}: SfiCommonModalProps) {
	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="sfi-modal-title"
			aria-describedby="sfi-modal-description"
			className="flex items-center justify-center p-4"
		>
			<div
				className={cn(
					'bg-mui-bg-paper border-mui-divider relative flex w-full flex-col overflow-hidden rounded-2xl border shadow-2xl focus:outline-none active:outline-none',
					maxWidthMap[maxWidth as keyof typeof maxWidthMap],
					className
				)}
			>
				{/* Header */}
				{(title || !hideCloseButton) && (
					<div
						className={cn(
							'border-mui-divider flex items-center justify-between border-b px-6 py-4',
							titleClassName
						)}
					>
						{title && (
							<Typography
								id="sfi-modal-title"
								variant="h6"
								className="text-mui-text-primary font-semibold"
							>
								{title}
							</Typography>
						)}
						{!hideCloseButton && (
							<IconButton
								onClick={onClose}
								size="small"
								className="text-mui-text-secondary hover:bg-mui-action-hover ml-auto"
								aria-label="close"
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						)}
					</div>
				)}

				{/* Content */}
				<div id="sfi-modal-description" className={cn('flex-1 overflow-y-auto px-6 py-8', contentClassName)}>
					{children}
				</div>

				{/* Footer */}
				{(footer || confirmBtn || cancelBtn) && (
					<div
						className={cn(
							'border-mui-divider bg-mui-bg-default/30 flex items-center justify-end gap-3 border-t px-6 py-4',
							footerClassName
						)}
					>
						{footer ? (
							footer
						) : (
							<>
								{cancelBtn && (
									<Button
										variant="contained"
										onClick={onClose}
										color="secondary"
										{...cancelBtn}
										className={cn('min-w-25', cancelBtn.className)}
									>
										{cancelBtn.label || 'Cancel'}
									</Button>
								)}
								{confirmBtn && (
									<Button
										variant="contained"
										color="primary"
										{...confirmBtn}
										className={cn('min-w-25', confirmBtn.className)}
									>
										{confirmBtn.label || 'Confirm'}
									</Button>
								)}
							</>
						)}
					</div>
				)}
			</div>
		</Modal>
	)
}

export default SfiCommonModal
