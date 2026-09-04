'use client'

import { SfiCollapse } from '@/components/collapse'
import { useEmailTemplateContext } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/providers/email-template-detail-provider'
import { useEmailTemplatePreview } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/hooks/use-email-template-preview'
import DesktopWindowsRoundedIcon from '@mui/icons-material/DesktopWindowsRounded'
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import { Alert, Button, ButtonGroup, Portal, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'

type PreviewDevice = 'desktop' | 'mobile'

const EMPTY_PREVIEW = '<p style="padding:20px;color:#888;">No preview available.</p>'

function LivePreview() {
	const { detailQuery, exportVisualEditor, previewRevision, setIsSendTestModalOpen } = useEmailTemplateContext()
	const previewData = useEmailTemplatePreview()
	const [device, setDevice] = useState<PreviewDevice>('desktop')
	const [isFullscreen, setIsFullscreen] = useState(false)

	useEffect(() => {
		if (!isFullscreen) return
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = previousOverflow
		}
	}, [isFullscreen])

	const preview = (
		<section
			className={
				isFullscreen
					? 'bg-mui-bg-paper fixed inset-0 overflow-y-auto p-4'
					: 'border-mui-divider bg-mui-bg-paper rounded-lg border p-4'
			}
			style={isFullscreen ? { zIndex: 1500 } : undefined}
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="text-mui-primary flex min-w-0 items-center gap-2 font-semibold">
					<VisibilityRoundedIcon className="shrink-0" fontSize="small" />
					<span className="truncate">Live Preview</span>
				</div>
				<ButtonGroup size="small" variant="outlined">
					<Tooltip title="Desktop View (100%)">
						<Button
							variant={device === 'desktop' ? 'contained' : 'outlined'}
							aria-label="Desktop View"
							sx={{ minWidth: 36, px: 1 }}
							onClick={() => setDevice('desktop')}
						>
							<DesktopWindowsRoundedIcon fontSize="small" />
						</Button>
					</Tooltip>
					<Tooltip title="Mobile View (375px)">
						<Button
							variant={device === 'mobile' ? 'contained' : 'outlined'}
							aria-label="Mobile View"
							sx={{ minWidth: 36, px: 1 }}
							onClick={() => setDevice('mobile')}
						>
							<PhoneIphoneRoundedIcon fontSize="small" />
						</Button>
					</Tooltip>
					<Tooltip title="Send Test Email">
						<Button
							aria-label="Send Test Email"
							sx={{ minWidth: 36, px: 1 }}
							onClick={async () => {
								await exportVisualEditor()
								setIsSendTestModalOpen(true)
							}}
						>
							<SendRoundedIcon fontSize="small" />
						</Button>
					</Tooltip>
					<Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}>
						<Button
							aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
							sx={{ minWidth: 36, px: 1 }}
							onClick={() => setIsFullscreen((current) => !current)}
						>
							{isFullscreen ? (
								<FullscreenExitRoundedIcon fontSize="medium" />
							) : (
								<FullscreenRoundedIcon fontSize="medium" />
							)}
						</Button>
					</Tooltip>
				</ButtonGroup>
			</div>

			{previewData.error && (
				<Alert className="mt-4" severity="error">
					{previewData.error}
				</Alert>
			)}

			<div className="mt-4 overflow-auto rounded-lg bg-white p-2">
				<div
					className="mx-auto max-w-full overflow-hidden rounded-lg"
					style={{ width: device === 'mobile' ? 375 : '100%' }}
				>
					<iframe
						key={previewRevision}
						srcDoc={previewData.html || EMPTY_PREVIEW}
						title="Live Preview"
						sandbox="allow-same-origin"
						className="block w-full border-0"
						style={{ height: isFullscreen ? 'calc(100vh - 160px)' : 650, background: '#ffffff' }}
					/>
				</div>
			</div>

			<SfiCollapse
				className="mt-4"
				contentClassName="p-3!"
				variant="outline"
				title="Evaluated Email Metadata"
				defaultExpanded
			>
				<div className="grid gap-2 text-xs">
					<div className="flex min-w-0 gap-2">
						<strong className="w-14 shrink-0">Subject</strong>
						<span className="truncate">{previewData.subject || '(No subject)'}</span>
					</div>
					{detailQuery.data?.data.category === 'email' && (
						<div className="grid gap-2">
							<div className="flex min-w-0 gap-2">
								<strong className="w-14 shrink-0">To</strong>
								<span className="truncate">{previewData.to.join(', ') || 'N/A'}</span>
							</div>
							{previewData.cc.length > 0 && (
								<div className="flex min-w-0 gap-2">
									<strong className="w-14 shrink-0">CC</strong>
									<span className="truncate">{previewData.cc.join(', ')}</span>
								</div>
							)}
							{previewData.bcc.length > 0 && (
								<div className="flex min-w-0 gap-2">
									<strong className="w-14 shrink-0">BCC</strong>
									<span className="truncate">{previewData.bcc.join(', ')}</span>
								</div>
							)}
						</div>
					)}
				</div>
			</SfiCollapse>
		</section>
	)

	return <Portal disablePortal={!isFullscreen}>{preview}</Portal>
}

export default LivePreview
