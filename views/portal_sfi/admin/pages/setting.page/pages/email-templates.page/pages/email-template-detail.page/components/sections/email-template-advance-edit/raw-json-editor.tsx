import Editor, { OnMount } from '@monaco-editor/react'
import { Button, useColorScheme } from '@mui/material'
import type { editor } from 'monaco-editor'
import { useRef } from 'react'

interface EmailTemplateRawJsonEditorProps {
	value: string
	error: string
	onChange: (value: string) => void
}

function EmailTemplateRawJsonEditor({ value, error, onChange }: EmailTemplateRawJsonEditorProps) {
	const { mode } = useColorScheme()
	const editorRef = useRef<editor.IStandaloneCodeEditor>(null)
	const handleMount: OnMount = (mountedEditor, monaco) => {
		editorRef.current = mountedEditor
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			allowComments: false,
			enableSchemaRequest: false,
		})
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-end">
				<Button
					size="small"
					variant="outlined"
					onClick={() => editorRef.current?.getAction('editor.action.formatDocument')?.run()}
				>
					Format JSON
				</Button>
			</div>
			<div
				className={`h-80 max-h-[70vh] min-h-48 resize-y overflow-hidden rounded-md border ${error ? 'border-mui-error-main' : 'border-mui-divider'}`}
			>
				<Editor
					height="100%"
					language="json"
					theme={mode === 'dark' ? 'vs-dark' : 'light'}
					value={value}
					onChange={(nextValue) => onChange(nextValue ?? '')}
					onMount={handleMount}
					options={{
						minimap: { enabled: false },
						formatOnPaste: true,
						formatOnType: true,
						automaticLayout: true,
						tabSize: 2,
						insertSpaces: true,
						wordWrap: 'on',
						scrollBeyondLastLine: false,
					}}
				/>
			</div>
			{error && <p className="text-mui-error text-xs">{error}</p>}
		</div>
	)
}

export default EmailTemplateRawJsonEditor
