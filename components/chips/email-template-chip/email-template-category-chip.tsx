'use client'

import SfiChipBase, { SfiChipBaseProps } from '@/components/chips/chip-base'
import { TEmailTemplateCategory } from '@/services/admin/staffs/email-templates/email-templates-req.dto'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'

interface EmailTemplateCategoryChipProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	category: TEmailTemplateCategory
}

function EmailTemplateCategoryChip({ category, ...props }: EmailTemplateCategoryChipProps) {
	switch (category) {
		case 'email':
			return (
				<SfiChipBase
					variant="info"
					label={
						<span className="flex items-center gap-1">
							<MailOutlineRoundedIcon sx={{ fontSize: 18 }} />
							Emails
						</span>
					}
					{...props}
				/>
			)
		case 'trading':
			return (
				<SfiChipBase
					variant="orange"
					label={
						<span className="flex items-center gap-1">
							<ShowChartRoundedIcon sx={{ fontSize: 18 }} />
							Trading
						</span>
					}
					{...props}
				/>
			)
		case 'snippet':
			return (
				<SfiChipBase
					variant="purple"
					label={
						<span className="flex items-center gap-1">
							<CodeRoundedIcon sx={{ fontSize: 18 }} />
							Snippets
						</span>
					}
					{...props}
				/>
			)
	}
}

export default EmailTemplateCategoryChip
