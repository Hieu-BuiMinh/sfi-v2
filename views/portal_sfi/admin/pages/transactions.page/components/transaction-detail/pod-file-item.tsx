import React from 'react'
import AttachmentIcon from '@mui/icons-material/Attachment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Button } from '@mui/material'
import { getAppConfig } from '@/utils/get-app-config'
import SfiFilePreviewModal from '@/components/modals/sfi-file-preview-modal'

interface PodFileItemProps {
	fileName: string
	url: string
}

export default function PodFileItem({ fileName, url }: PodFileItemProps) {
	const [openPreview, setOpenPreview] = React.useState(false)
	const variables = getAppConfig()

	const fullUrl = React.useMemo(() => {
		return `${variables?.api}/storage/${url}`.replace(/\/+/g, '/')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [variables?.api])

	const handleView = () => {
		setOpenPreview(true)
	}

	return (
		<>
			<div className="flex items-center justify-between gap-4 overflow-hidden">
				<div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
					<AttachmentIcon fontSize="small" className="text-mui-text-secondary shrink-0" />
					<div className="text-mui-text-primary truncate text-sm" title={fileName}>
						{fileName}
					</div>
				</div>
				<Button
					size="small"
					startIcon={<VisibilityIcon fontSize="small" />}
					onClick={handleView}
					variant="outlined"
				>
					View
				</Button>
			</div>

			<SfiFilePreviewModal
				open={openPreview}
				onClose={() => setOpenPreview(false)}
				url={fullUrl}
				title={fileName}
			/>
		</>
	)
}
