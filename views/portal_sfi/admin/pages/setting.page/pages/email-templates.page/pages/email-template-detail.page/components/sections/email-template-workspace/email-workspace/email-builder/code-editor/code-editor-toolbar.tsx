import { copyToClipboard } from '@/utils/copy-to-clipboard'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded'
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import { Button, Tooltip } from '@mui/material'

interface CodeEditorToolbarProps {
	content: string
	isFullscreen: boolean
	onFormat: () => void
	onToggleFullscreen: () => void
}

function CodeEditorToolbar({ content, isFullscreen, onFormat, onToggleFullscreen }: CodeEditorToolbarProps) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h3 className="text-mui-text-primary text-sm font-semibold">Template code</h3>
				<p className="text-mui-text-secondary text-xs">Edit the Blade markup used to render this email.</p>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button
					size="small"
					variant="outlined"
					startIcon={<FormatAlignLeftRoundedIcon fontSize="small" />}
					onClick={onFormat}
				>
					Format
				</Button>
				<Button
					size="small"
					variant="outlined"
					startIcon={<ContentCopyRoundedIcon fontSize="small" />}
					onClick={() => void copyToClipboard(content, 'Code copied to clipboard!')}
				>
					Copy
				</Button>
				<Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen code editor'}>
					<Button
						size="small"
						variant="outlined"
						aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen code editor'}
						sx={{ minWidth: 36, px: 1 }}
						onClick={onToggleFullscreen}
					>
						{isFullscreen ? (
							<FullscreenExitRoundedIcon fontSize="small" />
						) : (
							<FullscreenRoundedIcon fontSize="small" />
						)}
					</Button>
				</Tooltip>
			</div>
		</div>
	)
}

export default CodeEditorToolbar
