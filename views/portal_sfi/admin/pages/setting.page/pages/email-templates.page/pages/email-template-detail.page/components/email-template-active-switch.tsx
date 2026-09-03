'use client'

import { EmailTemplateCategoryChip, EmailTemplateLanguageChip } from '@/components/chips/email-template-chip'
import SfiSwitch from '@/components/inputs/sfi-switch'
import SfiCommonModal from '@/components/modals/common-modal'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { useState } from 'react'
import { useEmailTemplateContext } from './providers/email-template-detail-provider'

function EmailTemplateActiveSwitch() {
	const [open, setOpen] = useState(false)
	const { detailQuery } = useEmailTemplateContext()
	const template = detailQuery.data?.data

	if (!template) return null

	const action = template.is_active ? 'Deactivate' : 'Activate'

	return (
		<>
			<SfiSwitch
				checked={template.is_active}
				label={template.is_active ? 'Active' : 'Inactive'}
				containerClassName="!w-auto shrink-0"
				onChange={() => setOpen(true)}
				size="small"
			/>

			<SfiCommonModal
				open={open}
				onClose={() => setOpen(false)}
				title={
					<span className="text-mui-primary flex items-center gap-2">
						<WarningAmberRoundedIcon className="text-mui-primary" />
						{action} Email Template?
					</span>
				}
				maxWidth="sm"
				confirmBtn={{
					label: action,
					color: template.is_active ? 'error' : 'primary',
					onClick: () => setOpen(false),
				}}
				cancelBtn={{ label: 'Cancel', color: 'secondary' }}
			>
				<div className="flex flex-col gap-5">
					<p className="text-mui-text-primary text-sm">
						Are you sure you want to {action.toLowerCase()} template &quot;{template.slug}&quot;?
						{template.is_active && (
							<>
								<br /> While disabled, automated notifications using this template will be suspended
								until re-enabled.
							</>
						)}
					</p>

					<div className="border-mui-warning/50 bg-mui-warning/10 rounded-lg border p-4">
						<p className="text-mui-text-primary mb-2 text-sm font-semibold">Template: {template.name}</p>
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-mui-primary text-xs font-medium">Slug:</span>
							<span className="text-mui-text-primary text-xs break-all">{template.slug}</span>
							<EmailTemplateLanguageChip language={template.language} />
							<EmailTemplateCategoryChip category={template.category} />
						</div>
					</div>
				</div>
			</SfiCommonModal>
		</>
	)
}

export default EmailTemplateActiveSwitch
