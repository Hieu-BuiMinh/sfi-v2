'use client'

import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import PanToolAltRoundedIcon from '@mui/icons-material/PanToolAltRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Button, ButtonGroup } from '@mui/material'
import { useEmailTemplateContext } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/providers/email-template-detail-provider'
import VisualDragAndDropBuilder from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/sections/email-template-workspace/email-workspace/email-builder/visual-drag-and-drop-builder'
import EmailBuilderCodeEditor from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/sections/email-template-workspace/email-workspace/email-builder/code-editor'

function EmailBuilder() {
	const { editorMode, setEditorMode } = useEmailTemplateContext()

	return (
		<section className="border-mui-divider bg-mui-bg-paper rounded-lg border p-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="text-mui-primary flex min-w-0 items-center gap-2 font-semibold">
					<PanToolAltRoundedIcon className="shrink-0" fontSize="small" />
					<span className="truncate">Visual Drag &amp; Drop Builder (No-Code)</span>
				</div>

				<ButtonGroup className="shrink-0" size="small" variant="outlined">
					<Button
						variant={editorMode === 'visual-builder' ? 'contained' : 'outlined'}
						startIcon={<VisibilityOutlinedIcon fontSize="small" />}
						onClick={() => setEditorMode('visual-builder')}
					>
						Drag &amp; Drop
					</Button>
					<Button
						variant={editorMode === 'code-editor' ? 'contained' : 'outlined'}
						startIcon={<CodeRoundedIcon fontSize="small" />}
						onClick={() => setEditorMode('code-editor')}
					>
						Code Mode
					</Button>
				</ButtonGroup>
			</div>

			<div className="mt-4">
				{editorMode === 'visual-builder' ? <VisualDragAndDropBuilder /> : <EmailBuilderCodeEditor />}
			</div>
		</section>
	)
}

export default EmailBuilder
