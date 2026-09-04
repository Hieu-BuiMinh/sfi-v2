'use client'

import { useEmailTemplateContext } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/providers/email-template-detail-provider'
import type { JSONTemplate, UnlayerEditor } from '@unlayer/types'
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { Button, CircularProgress, IconButton, Portal, Tooltip } from '@mui/material'
import dynamic from 'next/dynamic'
import { useLocale } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { EditorRef } from 'react-email-editor'
import { htmlToUnlayerDesign } from './html-to-unlayer'

const EmailEditor = dynamic(() => import('react-email-editor'), {
	ssr: false,
	loading: () => (
		<div className="flex min-h-162.5 items-center justify-center">
			<CircularProgress size={32} />
		</div>
	),
})

function VisualDragAndDropBuilder() {
	const { form, detailQuery, registerVisualEditorExporter, setIsUpdateModalOpen, updateMutation } =
		useEmailTemplateContext()
	const template = detailQuery.data?.data
	const locale = useLocale()
	const editorRef = useRef<EditorRef>(null)
	const latestExportRef = useRef(0)
	const exportTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const projectId = template?.unlayer_project_id ? Number(template.unlayer_project_id) : undefined
	const targetLocale =
		locale === 'id' || locale === 'idn'
			? 'id-ID'
			: locale === 'en' || locale === 'eng'
				? 'en-US'
				: template?.language.toLowerCase() === 'idn' || template?.language.toLowerCase() === 'id'
					? 'id-ID'
					: 'en-US'

	const exportEditor = useCallback(
		() =>
			new Promise<void>((resolve) => {
				if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
				const editor = editorRef.current?.editor
				if (!editor) {
					resolve()
					return
				}

				const exportId = ++latestExportRef.current
				editor.exportHtml(({ design, html }) => {
					if (exportId === latestExportRef.current) {
						form.setValue('blade_content', html, { shouldDirty: true })
						form.setValue('unlayer_design', design as Record<string, unknown>, { shouldDirty: true })
					}
					resolve()
				})
			}),
		[form]
	)
	useEffect(() => {
		registerVisualEditorExporter(exportEditor)

		return () => {
			if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
			registerVisualEditorExporter(null)
		}
	}, [exportEditor, registerVisualEditorExporter])

	useEffect(() => {
		if (!isFullscreen) return

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = previousOverflow
		}
	}, [isFullscreen])

	const handleReady = (editor: UnlayerEditor<'email'>) => {
		editorRef.current = { editor }
		editor.addEventListener('design:loaded', () => {
			editor.addEventListener('design:updated', () => {
				if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
				exportTimeoutRef.current = setTimeout(() => void exportEditor(), 400)
			})
		})
		editor.setTheme('modern_dark')
		editor.setLocale(targetLocale)
		editor.setMergeTags(
			Object.fromEntries(
				(template?.available_variables ?? []).map((variable) => [
					variable.key,
					{
						name: `${variable.label} (${variable.key})`,
						value: variable.key,
					},
				])
			)
		)

		const savedDesign = form.getValues('unlayer_design')
		const content =
			savedDesign && Object.keys(savedDesign).length > 0 ? savedDesign : form.getValues('blade_content')
		editor.loadDesign(htmlToUnlayerDesign(content) as JSONTemplate<'email'>)
	}

	const toggleFullscreen = async () => {
		await exportEditor()
		setIsFullscreen((current) => !current)
	}

	return (
		<Portal disablePortal={!isFullscreen}>
			<div
				className={
					isFullscreen
						? 'bg-mui-bg-paper fixed inset-0 overflow-hidden p-2'
						: 'border-mui-divider relative overflow-hidden rounded-lg border'
				}
				style={isFullscreen ? { zIndex: 1500 } : undefined}
			>
				<Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}>
					<IconButton
						color="primary"
						sx={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
						onClick={toggleFullscreen}
						aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
					>
						{isFullscreen ? (
							<FullscreenExitRoundedIcon fontSize="small" />
						) : (
							<FullscreenRoundedIcon fontSize="small" />
						)}
					</IconButton>
				</Tooltip>

				<EmailEditor
					key={`${template?.id ?? 'editor'}-${targetLocale}`}
					ref={editorRef}
					onReady={handleReady}
					minHeight={isFullscreen ? 'calc(100vh - 32px)' : '650px'}
					options={{
						projectId,
						displayMode: 'email',
						locale: targetLocale,
						appearance: { theme: 'modern_dark' },
						features: { preview: false },
					}}
				/>

				{!isFullscreen && (
					<div className="border-mui-divider flex justify-end border-t p-3">
						<Button
							variant="contained"
							startIcon={<SaveRoundedIcon fontSize="small" />}
							loading={updateMutation.isPending}
							onClick={() => setIsUpdateModalOpen(true)}
						>
							Update Template
						</Button>
					</div>
				)}
			</div>
		</Portal>
	)
}

export default VisualDragAndDropBuilder
