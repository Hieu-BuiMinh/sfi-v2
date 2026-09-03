'use client'

import RfhSfiMultiAutocomplete from '@/components/rhf-inputs/rfh-sfi-multi-autocomplete'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { SfiOption } from '@/components/inputs/types'
import { SfiCollapse } from '@/components/collapse'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import { EmailTemplateFormValues, useEmailTemplateContext } from '../../../providers/email-template-detail-provider'

interface RecipientField {
	name: 'to' | 'cc' | 'bcc'
	label: string
	helperText?: string
	options: SfiOption[]
}

const RECIPIENT_FIELDS: RecipientField[] = [
	{
		name: 'to',
		label: 'To: Primary Recipients (Single or Multiple)',
		// helperText: `Enter email addresses or dynamic expressions (e.g. {{ $data['email'] }}). Press Enter or comma to add.`,
		options: [
			{ label: 'Email', value: `{{ $data['email'] }}` },
			{ label: 'Ops email', value: `{{ $data['ops_email'] }}` },
			{ label: 'User email', value: `{{ $data['user_email'] }}` },
		],
	},
	{
		name: 'cc',
		label: 'CC: Carbon Copy (Optional)',
		// helperText: 'Optional CC recipient addresses.',
		options: [
			{ label: 'cs@panasia.id', value: 'cs@panasia.id' },
			{ label: 'partners@panasia.id', value: 'partners@panasia.id' },
			{ label: 'Agent email', value: `{{ $data['agent_email'] }}` },
		],
	},
	{
		name: 'bcc',
		label: 'BCC: Blind Carbon Copy (Optional)',
		// helperText: 'Optional BCC audit/compliance recipient addresses.',
		options: [
			{ label: 'panasiaadmin@yopmail.com', value: 'panasiaadmin@yopmail.com' },
			{ label: 'audit@panasia.id', value: 'audit@panasia.id' },
		],
	},
]

function EmailMetaInfoForm() {
	const { form } = useEmailTemplateContext()

	return (
		<SfiCollapse
			title="General Information & Subject Routing"
			subtitle="Manage primary recipients, CC copies, and BCC audit headers."
			icon={<MailOutlineRoundedIcon sx={{ fontSize: 20 }} />}
			defaultExpanded
			contentClassName="flex flex-col gap-10"
		>
			<div className="grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
				<RfhSfiTextField
					name="subject"
					control={form.control}
					label="Email Subject Line (Supports dynamic tags)"
					size="large"
					containerClassName="col-span-1"
				/>
				<span className="col-span-1 hidden lg:block" />

				<RfhSfiTextField
					name="description"
					control={form.control}
					label="Template Description (Admin Reference)"
					size="medium"
					multiline
					minRows={4}
					slotProps={{ input: { className: 'p-0!' } }}
					containerClassName="col-span-1"
				/>
				<span className="col-span-1 hidden lg:block" />
			</div>

			<div className="grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
				{RECIPIENT_FIELDS.map((field) => (
					<RfhSfiMultiAutocomplete<EmailTemplateFormValues>
						key={field.name}
						name={field.name}
						control={form.control}
						size="large"
						options={field.options}
						helperText={field.helperText}
						disableCloseOnSelect
						label={field.label}
					/>
				))}
			</div>
		</SfiCollapse>
	)
}

export default EmailMetaInfoForm
