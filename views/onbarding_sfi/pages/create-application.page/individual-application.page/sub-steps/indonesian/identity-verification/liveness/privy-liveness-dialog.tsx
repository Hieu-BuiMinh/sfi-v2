'use client'

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'

interface PrivyLivenessDialogProps {
	url: string | null
	isProcessing: boolean
	onClose: () => void
}

export default function PrivyLivenessDialog({ url, isProcessing, onClose }: PrivyLivenessDialogProps) {
	return (
		<Dialog open={Boolean(url)} onClose={isProcessing ? undefined : onClose} maxWidth="md" fullWidth>
			<DialogContent className="h-[75vh] p-0">
				{url && (
					<iframe
						title="Privy liveness verification"
						src={url}
						allow="camera *; microphone *; autoplay *;"
						className="size-full border-0"
					/>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isProcessing}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}
