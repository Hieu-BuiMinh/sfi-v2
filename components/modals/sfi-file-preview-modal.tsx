/* eslint-disable @next/next/no-img-element */
'use client'

import SfiCommonModal from '@/components/modals/common-modal'
import { cn } from '@/utils/cn'

interface SfiFilePreviewModalProps {
	url?: string | null
	open: boolean
	onClose: () => void
	title?: string
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	className?: string
	contentClassName?: string
}

const SfiFilePreviewModal = ({
	url,
	open,
	onClose,
	title = 'File Preview',
	maxWidth = 'md',
	className,
	contentClassName,
}: SfiFilePreviewModalProps) => {
	return (
		<SfiCommonModal
			open={open}
			onClose={onClose}
			title={title}
			maxWidth={maxWidth}
			className={className}
			contentClassName={cn('p-0!', contentClassName)}
			hideCloseButton={false}
		>
			<div className="bg-mui-bg-default flex min-h-50 w-full items-center justify-center">
				{url ? (
					<img src={url} alt="File Preview" className="max-h-[80vh] max-w-full object-contain" />
				) : (
					<div className="text-mui-text-secondary flex flex-col items-center justify-center p-8">
						<p>No preview available</p>
					</div>
				)}
			</div>
		</SfiCommonModal>
	)
}

export default SfiFilePreviewModal
