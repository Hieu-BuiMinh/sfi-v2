import { SfiCollapse } from '@/components/collapse'
import { TEmailTemplateVariable } from '@/services/admin/staffs/email-templates/email-templates-res.dto'
import { copyToClipboard } from '@/utils/copy-to-clipboard'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import { Chip } from '@mui/material'

interface AvailableVariablesSectionProps {
	variables: TEmailTemplateVariable[]
	onInsert: (value: string) => void
}

function AvailableVariablesSection({ variables, onInsert }: AvailableVariablesSectionProps) {
	return (
		<SfiCollapse
			title="Available variables"
			subtitle="Click to insert, or use the copy icon."
			badge={variables.length}
			contentClassName="p-3!"
		>
			<div className="flex flex-wrap gap-2">
				{variables.map((variable) => (
					<Chip
						key={variable.key}
						label={`${variable.label}: ${variable.key}`}
						variant="outlined"
						size="small"
						onClick={() => onInsert(variable.key)}
						onDelete={() => void copyToClipboard(variable.key, `Copied ${variable.key}`)}
						deleteIcon={<ContentCopyRoundedIcon />}
					/>
				))}
			</div>
		</SfiCollapse>
	)
}

export default AvailableVariablesSection
