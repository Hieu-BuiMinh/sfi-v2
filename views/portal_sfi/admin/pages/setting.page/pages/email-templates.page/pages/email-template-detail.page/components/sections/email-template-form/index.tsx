import EmailMetaInfoForm from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/sections/email-template-form/email-meta-info-form'
import EmailTemplateAdvanceEdit from '../email-template-advance-edit'
import EmailTemplateWorkspace from '../email-template-workspace'
import EmailTemplatePdfAttachment from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/sections/email-pdf-attachment'

function EmailTemplateFrom() {
	return (
		<div className="mt-4 flex flex-col gap-6">
			<EmailMetaInfoForm />
			<EmailTemplatePdfAttachment />
			<EmailTemplateAdvanceEdit />
			<EmailTemplateWorkspace />
		</div>
	)
}

export default EmailTemplateFrom
