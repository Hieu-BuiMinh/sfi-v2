'use client'

import toastUtil from '@/utils/toast'
import { useEmailTemplateContext } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/providers/email-template-detail-provider'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { Button, CircularProgress, Portal, useColorScheme } from '@mui/material'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useWatch } from 'react-hook-form'
import type { OnMount } from '@monaco-editor/react'
import AvailableVariablesSection from './available-variables-section'
import CodeEditorToolbar from './code-editor-toolbar'
import CodeSnippetsSection from './code-snippets-section'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
	ssr: false,
	loading: () => (
		<div className="flex h-145 items-center justify-center">
			<CircularProgress size={32} />
		</div>
	),
})

type MonacoInstance = Parameters<OnMount>[0]

function EmailBuilderCodeEditor() {
	const { mode } = useColorScheme()
	const { form, detailQuery, markCodeContentChanged, setIsUpdateModalOpen, updateMutation } =
		useEmailTemplateContext()
	const template = detailQuery.data?.data
	const bladeContent = useWatch({ control: form.control, name: 'blade_content' })
	const editorRef = useRef<MonacoInstance | null>(null)
	const [isFullscreen, setIsFullscreen] = useState(false)

	useEffect(() => {
		if (!isFullscreen) return
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previousOverflow
		}
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
		<div
			className={isFullscreen ? 'bg-mui-bg-paper fixed inset-0 overflow-auto p-4' : 'flex flex-col gap-4'}
			style={isFullscreen ? { zIndex: 1500 } : undefined}
		>
			<CodeEditorToolbar
				content={bladeContent}
				isFullscreen={isFullscreen}
				onFormat={() => void editorRef.current?.getAction('editor.action.formatDocument')?.run()}
				onToggleFullscreen={() => setIsFullscreen((current) => !current)}
			/>

			<div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-2">
				<AvailableVariablesSection variables={template?.available_variables ?? []} onInsert={insertAtCursor} />
				<CodeSnippetsSection
					onInsert={(value) => {
						insertAtCursor(value)
						toastUtil.info('Snippet inserted into editor!')
					}}
				/>
			</div>

			<div className="border-mui-divider overflow-hidden rounded-lg border">
				<MonacoEditor
					height={isFullscreen ? 'calc(100vh - 180px)' : '580px'}
					language="html"
					theme={mode === 'dark' ? 'vs-dark' : 'light'}
					value={bladeContent}
					onChange={(value) => {
						const nextValue = value ?? ''
						if (nextValue === form.getValues('blade_content')) return

						form.setValue('blade_content', nextValue, { shouldDirty: true })
						markCodeContentChanged()
					}}
					onMount={(editor) => {
						editorRef.current = editor
					}}
					options={{
						minimap: { enabled: false },
						fontSize: 13,
						wordWrap: 'on',
						automaticLayout: true,
						scrollBeyondLastLine: false,
						tabSize: 2,
						formatOnPaste: true,
						formatOnType: true,
					}}
				/>
			</div>

			<div className="flex justify-end">
				<Button
					variant="contained"
					startIcon={<SaveRoundedIcon fontSize="small" />}
					loading={updateMutation.isPending}
					onClick={() => setIsUpdateModalOpen(true)}
				>
					Update Template
				</Button>
			</div>
		</div>
	)

	return <Portal disablePortal={!isFullscreen}>{content}</Portal>
}

export default EmailBuilderCodeEditor
