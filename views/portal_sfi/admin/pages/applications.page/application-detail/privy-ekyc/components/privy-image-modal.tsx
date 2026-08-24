/* eslint-disable @next/next/no-img-element */
import SfiCommonModal from '@/components/modals/common-modal'

interface PrivyImageModalProps {
	open: boolean
	title: string
	image: string | null
	onClose: () => void
}

export default function PrivyImageModal({ open, title, image, onClose }: PrivyImageModalProps) {
	return (
		<SfiCommonModal
			open={open}
			onClose={onClose}
			title={title}
			maxWidth="lg"
			contentClassName="flex max-h-[75vh] items-center justify-center bg-black/5 p-4"
		>
			{image && <img src={image} alt={title} className="max-h-[70vh] max-w-full rounded-lg object-contain" />}
		</SfiCommonModal>
	)
}
