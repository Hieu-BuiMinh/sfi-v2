'use client'

import { SfiCollapse } from '@/components/collapse'
import { useEmailTemplateContext } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/providers/email-template-detail-provider'
import { parseSampleData } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/utils/sample-data'
import DesktopWindowsRoundedIcon from '@mui/icons-material/DesktopWindowsRounded'
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import { Alert, Button, ButtonGroup, CircularProgress, Portal, Tooltip } from '@mui/material'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useWatch } from 'react-hook-form'

type PreviewDevice = 'desktop' | 'mobile'

const EMPTY_PREVIEW = '<p style="padding:20px;color:#888;">No preview generated yet.</p>'

function LivePreview() {
	const { form, detailQuery, previewMutation, exportVisualEditor, setIsSendTestModalOpen } = useEmailTemplateContext()
	const template = detailQuery.data?.data
	const [subject, to, cc, bcc, bladeContent, sampleDataJson] = useWatch({
		control: form.control,
		name: ['subject', 'to', 'cc', 'bcc', 'blade_content', 'sample_data_json'],
	})
	const [device, setDevice] = useState<PreviewDevice>('desktop')
	const [background] = useState('#ffffff')
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [previewHtml, setPreviewHtml] = useState('')
	const [previewSubject, setPreviewSubject] = useState('')
	const [renderedTo, setRenderedTo] = useState<string[]>([])
	const [renderedCc, setRenderedCc] = useState<string[]>([])
	const [renderedBcc, setRenderedBcc] = useState<string[]>([])
	const [previewError, setPreviewError] = useState<string | null>(null)
	const latestRequestRef = useRef(0)
	const lastPreviewPayloadRef = useRef('')
	const previewEmailTemplate = previewMutation.mutateAsync

	const fetchPreview = useCallback(
		async (force = false) => {
			if (!template) return

			await exportVisualEditor()
			const values = form.getValues()
			const parsedSampleData = parseSampleData(values.sample_data_json)
			if (!parsedSampleData.data) {
				setPreviewError(parsedSampleData.error)
				return
			}

			const payload = {
				blade_content: values.blade_content,
				html_content: values.blade_content,
				subject: values.subject,
				to: values.to,
				cc: values.cc,
				bcc: values.bcc,
				sample_data: parsedSampleData.data,
			}
			const serializedPayload = JSON.stringify(payload)
			if (!force && serializedPayload === lastPreviewPayloadRef.current) return

			lastPreviewPayloadRef.current = serializedPayload
			const requestId = ++latestRequestRef.current
			setPreviewError(null)

			try {
				const response = await previewEmailTemplate(payload)
				if (requestId !== latestRequestRef.current) return

				if (!response.data.success) {
					setPreviewHtml(response.data.rendered_html || '')
					setRenderedTo([])
					setRenderedCc([])
					setRenderedBcc([])
					setPreviewError(response.data.error || 'Failed to render preview.')
					return
				}

				setPreviewHtml(response.data.rendered_html)
				setPreviewSubject(response.data.rendered_subject)
				setRenderedTo(response.data.rendered_to)
				setRenderedCc(response.data.rendered_cc)
				setRenderedBcc(response.data.rendered_bcc)
			} catch (error) {
				if (requestId !== latestRequestRef.current) return
				setRenderedTo([])
				setRenderedCc([])
				setRenderedBcc([])
				setPreviewError(
					axios.isAxiosError(error)
						? error.response?.data?.message || error.message
						: 'Preview rendering failed.'
				)
			}
		},
		[exportVisualEditor, form, previewEmailTemplate, template]
	)

	useEffect(() => {
		if (!template) return
		const timeout = setTimeout(() => void fetchPreview(), 600)

		return () => clearTimeout(timeout)
	}, [bcc, bladeContent, cc, fetchPreview, sampleDataJson, subject, template, to])

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
					<Tooltip title="Render the latest editor and form changes">
						<Button
							aria-label="Update Preview"
							disabled={previewMutation.isPending}
							onClick={() => void fetchPreview(true)}
						>
							{previewMutation.isPending ? (
								<CircularProgress size={20} />
							) : (
								<RefreshRoundedIcon fontSize="medium" />
							)}
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

			{previewError && (
				<Alert className="mt-4" severity="error">
					{previewError}
				</Alert>
			)}

			<div className="mt-4 overflow-auto rounded-lg p-2 transition-colors" style={{ background }}>
				<div
					className="mx-auto max-w-full overflow-hidden rounded-lg"
					style={{ width: device === 'mobile' ? 375 : '100%' }}
				>
					{previewMutation.isPending ? (
						<div
							className="flex items-center justify-center"
							style={{ height: isFullscreen ? 'calc(100vh - 160px)' : 650 }}
						>
							<CircularProgress />
						</div>
					) : (
						<iframe
							srcDoc={previewHtml || EMPTY_PREVIEW}
							title="Live Preview"
							sandbox="allow-same-origin"
							className="block w-full border-0"
							style={{ height: isFullscreen ? 'calc(100vh - 160px)' : 650, background }}
						/>
					)}
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
						<span className="truncate">{previewSubject || subject || '(No subject)'}</span>
					</div>
					{template?.category === 'email' && (
						<div className="grid gap-2">
							<div className="flex min-w-0 gap-2">
								<strong className="w-14 shrink-0">To</strong>
								<span className="truncate">{renderedTo.join(', ') || 'N/A'}</span>
							</div>
							{renderedCc.length > 0 && (
								<div className="flex min-w-0 gap-2">
									<strong className="w-14 shrink-0">CC</strong>
									<span className="truncate">{renderedCc.join(', ')}</span>
								</div>
							)}
							{renderedBcc.length > 0 && (
								<div className="flex min-w-0 gap-2">
									<strong className="w-14 shrink-0">BCC</strong>
									<span className="truncate">{renderedBcc.join(', ')}</span>
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
