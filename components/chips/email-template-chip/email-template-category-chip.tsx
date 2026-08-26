'use client'

import SfiChipBase, { SfiChipBaseProps } from '@/components/chips/chip-base'
import { TEmailTemplateCategory } from '@/services/admin/staffs/email-templates/email-templates-req.dto'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'

interface EmailTemplateCategoryChipProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	category: TEmailTemplateCategory
}

function EmailTemplateCategoryChip({ category, ...props }: EmailTemplateCategoryChipProps) {
	const isEmail = category === 'email'

	return (
		<SfiChipBase
			variant={isEmail ? 'info' : 'purple'}
			label={
				<span className="flex items-center gap-1">
					{isEmail ? (
						<MailOutlineRoundedIcon sx={{ fontSize: 18 }} />
					) : (
						<CodeRoundedIcon sx={{ fontSize: 18 }} />
					)}
					{isEmail ? 'Emails' : 'Snippets'}
				</span>
			}
			{...props}
		/>
	)
}

export default EmailTemplateCategoryChip
