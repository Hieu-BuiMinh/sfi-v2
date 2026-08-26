import EmailTemplateDetailPageView from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page'

interface EmailTemplateDetailPageProps {
	params: Promise<{ id: string }>
}

async function EmailTemplateDetailPage({ params }: EmailTemplateDetailPageProps) {
	const { id } = await params

	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<EmailTemplateDetailPageView id={id} />
		</div>
	)
}

export default EmailTemplateDetailPage
