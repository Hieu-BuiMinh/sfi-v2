'use client'

import toastUtil from '@/utils/toast'
import { useEmailTemplateContext } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/providers/email-template-detail-provider'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded'
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import { Button, Chip, CircularProgress, Portal, Tooltip } from '@mui/material'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useWatch } from 'react-hook-form'
import type { OnMount } from '@monaco-editor/react'
import { EMAIL_CODE_SNIPPETS } from './snippets'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
	ssr: false,
	loading: () => <div className="flex h-145 items-center justify-center"><CircularProgress size={32} /></div>,
})

type MonacoInstance = Parameters<OnMount>[0]

function EmailBuilderCodeEditor() {
	const { form, detailQuery } = useEmailTemplateContext()
	const template = detailQuery.data?.data
	const bladeContent = useWatch({ control: form.control, name: 'blade_content' })
	const editorRef = useRef<MonacoInstance | null>(null)
	const [isFullscreen, setIsFullscreen] = useState(false)

	useEffect(() => {
		if (!isFullscreen) return
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => { document.body.style.overflow = previousOverflow }
	}, [isFullscreen])

	const insertAtCursor = (content: string) => {
		const editor = editorRef.current
		if (!editor) {
			form.setValue('blade_content', `${bladeContent}${content}`, { shouldDirty: true })
			return
		}

		const position = editor.getPosition() ?? { lineNumber: 1, column: 1 }
		const range = editor.getSelection() ?? {
			startLineNumber: position.lineNumber,
			startColumn: position.column,
			endLineNumber: position.lineNumber,
			endColumn: position.column,
		}
		editor.executeEdits('email-code-editor', [{ range, text: content, forceMoveMarkers: true }])
		editor.focus()
	}

	const content = (
		<div className={isFullscreen ? 'bg-mui-bg-paper fixed inset-0 overflow-auto p-4' : 'flex flex-col gap-4'} style={isFullscreen ? { zIndex: 1500 } : undefined}>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex min-w-0 flex-wrap gap-2">
					{template?.available_variables.map((variable) => (
						<Chip key={variable.key} label={`${variable.label}: ${variable.key}`} variant="outlined" onClick={() => insertAtCursor(variable.key)} onDelete={() => { void navigator.clipboard.writeText(variable.key); toastUtil.info(`Copied ${variable.key}`) }} deleteIcon={<ContentCopyRoundedIcon />} />
					))}
				</div>
				<div className="flex shrink-0 gap-2">
					<Button size="small" variant="outlined" startIcon={<FormatAlignLeftRoundedIcon fontSize="small" />} onClick={() => void editorRef.current?.getAction('editor.action.formatDocument')?.run()}>Format Code</Button>
					<Button size="small" variant="outlined" startIcon={<ContentCopyRoundedIcon fontSize="small" />} onClick={() => { void navigator.clipboard.writeText(bladeContent); toastUtil.info('Code copied to clipboard!') }}>Copy</Button>
					<Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Code Editor'}>
						<Button size="small" variant="outlined" aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Code Editor'} sx={{ minWidth: 36, px: 1 }} onClick={() => setIsFullscreen((current) => !current)}>
							{isFullscreen ? <FullscreenExitRoundedIcon fontSize="small" /> : <FullscreenRoundedIcon fontSize="small" />}
						</Button>
					</Tooltip>
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				{EMAIL_CODE_SNIPPETS.map((snippet) => (
					<Button key={snippet.label} size="small" variant="outlined" onClick={() => { insertAtCursor(snippet.content); toastUtil.info('Snippet inserted into editor!') }}>+ {snippet.label}</Button>
				))}
			</div>

			<div className="border-mui-divider overflow-hidden rounded-lg border">
				<MonacoEditor height={isFullscreen ? 'calc(100vh - 180px)' : '580px'} language="html" theme="vs-dark" value={bladeContent} onChange={(value) => form.setValue('blade_content', value ?? '', { shouldDirty: true })} onMount={(editor) => { editorRef.current = editor }} options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', automaticLayout: true, scrollBeyondLastLine: false, tabSize: 2, formatOnPaste: true, formatOnType: true }} />
			</div>
		</div>
	)

	return <Portal disablePortal={!isFullscreen}>{content}</Portal>
}

export default EmailBuilderCodeEditor
