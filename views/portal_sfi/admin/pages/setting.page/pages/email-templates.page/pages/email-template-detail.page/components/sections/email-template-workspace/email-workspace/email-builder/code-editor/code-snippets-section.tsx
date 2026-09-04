import { SfiCollapse } from '@/components/collapse'
import { Button } from '@mui/material'
import { EMAIL_CODE_SNIPPETS } from './snippets'

interface CodeSnippetsSectionProps {
	onInsert: (value: string) => void
}

function CodeSnippetsSection({ onInsert }: CodeSnippetsSectionProps) {
	return (
		<SfiCollapse
			title="Quick snippets"
			subtitle="Insert a common Blade block at the cursor."
			badge={EMAIL_CODE_SNIPPETS.length}
			contentClassName="p-3!"
		>
			<div className="flex flex-wrap gap-2">
				{EMAIL_CODE_SNIPPETS.map((snippet) => (
					<Button
						key={snippet.label}
						size="small"
						variant="outlined"
						onClick={() => onInsert(snippet.content)}
					>
						{snippet.label}
					</Button>
				))}
			</div>
		</SfiCollapse>
	)
}

export default CodeSnippetsSection
