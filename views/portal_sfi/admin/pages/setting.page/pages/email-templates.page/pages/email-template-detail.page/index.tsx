'use client'

import { EmailTemplateCategoryChip, EmailTemplateLanguageChip } from '@/components/chips/email-template-chip'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { Skeleton } from '@mui/material'
import EmailTemplateActiveSwitch from './components/email-template-active-switch'
import EmailTemplateFrom from './components/sections/email-template-form'
import EmailTemplateDetailProvider, {
	useEmailTemplateContext,
} from './components/providers/email-template-detail-provider'

interface EmailTemplateDetailPageViewProps {
	id: string
}

function EmailTemplateDetailContent() {
	const { template, isLoading } = useEmailTemplateContext()

	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[{ label: 'Email Templates', href: '/settings/email-templates' }, { label: 'Template Detail' }]}
			/>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<SfiPageTitle title={template?.name ?? 'Email Template Detail'} />
				{template && <EmailTemplateActiveSwitch />}
			</div>

			<section className="border-mui-divider bg-mui-bg-paper rounded-lg border p-5">
				{isLoading ? (
					<Skeleton variant="rectangular" height={160} className="rounded" />
				) : (
					<div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
						<span className="text-mui-text-secondary text-xs font-medium">Template ID</span>
						<span className="text-mui-text-primary text-xs break-all">{template?.id}</span>

						<span className="text-mui-text-secondary text-xs font-medium">Slug</span>
						<span className="text-mui-primary text-xs break-all">{template?.slug}</span>

						<span className="text-mui-text-secondary text-xs font-medium">Category</span>
						<div>{template && <EmailTemplateCategoryChip category={template.category} />}</div>

						<span className="text-mui-text-secondary text-xs font-medium">Language</span>
						<div>{template && <EmailTemplateLanguageChip language={template.language} />}</div>

						<span className="text-mui-text-secondary text-xs font-medium">Subject</span>
						<span className="text-mui-text-primary text-xs">{template?.subject}</span>
					</div>
				)}
			</section>

			{template && <EmailTemplateFrom />}
		</div>
	)
}

function EmailTemplateDetailPageView({ id }: EmailTemplateDetailPageViewProps) {
	return (
		<EmailTemplateDetailProvider id={id}>
			<EmailTemplateDetailContent />
		</EmailTemplateDetailProvider>
	)
}

export default EmailTemplateDetailPageView
