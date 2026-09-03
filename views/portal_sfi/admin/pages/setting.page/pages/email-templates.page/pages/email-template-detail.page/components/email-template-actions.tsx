'use client'

import SfiCheckbox from '@/components/inputs/sfi-checkbox'
import SfiTextField from '@/components/inputs/sfi-textfield'
import SfiCommonModal from '@/components/modals/common-modal'
import toastUtil from '@/utils/toast'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import { z } from 'zod'
import { useEmailTemplateContext } from './providers/email-template-detail-provider'
import { parseSampleData } from '../utils/sample-data'
const emailSchema = z.string().email()

function EmailTemplateActions() {
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
	const [recipientEmail, setRecipientEmail] = useState('')
	const [includeCcBcc, setIncludeCcBcc] = useState(false)
	const {
		form,
		detailQuery,
		updateMutation,
		sendTestEmailMutation,
		exportVisualEditor,
		isSendTestModalOpen,
		setIsSendTestModalOpen,
	} = useEmailTemplateContext()
	const template = detailQuery.data?.data
	const recipientEmailValue = recipientEmail.trim()
	const isRecipientEmailValid = emailSchema.safeParse(recipientEmailValue).success

	const handleCloseSendTestModal = () => {
		if (sendTestEmailMutation.isPending) return

		setIsSendTestModalOpen(false)
		setRecipientEmail('')
		setIncludeCcBcc(false)
	}

	const handleSendTestEmail = async () => {
		if (!template || !isRecipientEmailValid) return

		await exportVisualEditor()
		const values = form.getValues()
		const parsedSampleData = parseSampleData(values.sample_data_json)
		if (!parsedSampleData.data) {
			toastUtil.error(parsedSampleData.error)
			return
		}
		form.setValue('sample_data_json', JSON.stringify(parsedSampleData.data, null, 2))

		try {
			const response = await sendTestEmailMutation.mutateAsync({
				recipient_email: recipientEmailValue,
				blade_content: values.blade_content,
				subject: values.subject,
				to: values.to,
				cc: values.cc,
				bcc: values.bcc,
				include_cc_bcc: includeCcBcc,
				sample_data: parsedSampleData.data,
			})
			handleCloseSendTestModal()
			toastUtil.success(response.message)
		} catch {
			toastUtil.error('Failed to send test email.')
		}
	}

	const saveEmailTemplate = form.handleSubmit(async (values) => {
		if (!template) return
		const parsedSampleData = parseSampleData(values.sample_data_json)
		if (!parsedSampleData.data) {
			toastUtil.error(parsedSampleData.error)
			return
		}
		form.setValue('sample_data_json', JSON.stringify(parsedSampleData.data, null, 2))

		try {
			await updateMutation.mutateAsync({
				name: template.name,
				subject: values.subject,
				title: values.subject,
				to: values.to,
				cc: values.cc,
				bcc: values.bcc,
				description: values.description,
				blade_content: values.blade_content,
				html_content: values.blade_content,
				unlayer_design: values.unlayer_design,
				is_active: template.is_active,
				sample_data: parsedSampleData.data,
				change_note: 'Updated via Visual Drag & Drop Builder',
			})
			setIsSaveModalOpen(false)
			toastUtil.success('Email template saved and published successfully.')
		} catch {
			toastUtil.error('Failed to save and publish email template.')
		}
	})
	const handleSave = async () => {
		await exportVisualEditor()
		await saveEmailTemplate()
	}

	return (
		<>
			<div className="flex flex-wrap items-center gap-2">
				<IconButton
					color="primary"
					size="medium"
					onClick={() => setIsSendTestModalOpen(true)}
					aria-label="Send Test Email"
					className="border-mui-primary sm:hidden"
				>
					<SendRoundedIcon fontSize="small" />
				</IconButton>
				<IconButton
					color="primary"
					size="medium"
					onClick={() => setIsSaveModalOpen(true)}
					aria-label="Save & Publish Live"
					className="bg-mui-primary text-mui-primary-contrastText hover:bg-mui-primary-dark sm:hidden"
				>
					<SaveRoundedIcon fontSize="small" />
				</IconButton>
			</div>

			<SfiCommonModal
				open={isSendTestModalOpen}
				onClose={handleCloseSendTestModal}
				title="Send Test Email"
				maxWidth="sm"
				confirmBtn={{
					label: 'Send Test Email',
					startIcon: <SendRoundedIcon />,
					onClick: handleSendTestEmail,
					loading: sendTestEmailMutation.isPending,
					disabled: !isRecipientEmailValid,
				}}
				cancelBtn={{
					label: 'Cancel',
					onClick: handleCloseSendTestModal,
					disabled: sendTestEmailMutation.isPending,
				}}
			>
				<div className="flex flex-col gap-4">
					<SfiTextField
						type="email"
						label="Recipient Email Address"
						value={recipientEmail}
						onChange={(event) => setRecipientEmail(event.target.value)}
						error={Boolean(recipientEmailValue) && !isRecipientEmailValid}
						helperText={
							Boolean(recipientEmailValue) && !isRecipientEmailValid
								? 'Please enter a valid email address.'
								: undefined
						}
						disabled={sendTestEmailMutation.isPending}
						autoFocus
					/>
					<SfiCheckbox
						label="Also send to CC & BCC recipients"
						checked={includeCcBcc}
						onChange={(event) => setIncludeCcBcc(event.target.checked)}
						disabled={sendTestEmailMutation.isPending}
					/>
				</div>
			</SfiCommonModal>

			<SfiCommonModal
				open={isSaveModalOpen}
				onClose={() => setIsSaveModalOpen(false)}
				title="Save & Publish Email Template"
				maxWidth="sm"
				confirmBtn={{
					label: 'Save & Publish',
					startIcon: <SaveRoundedIcon />,
					onClick: handleSave,
					loading: updateMutation.isPending,
				}}
				cancelBtn={{
					label: 'Cancel',
					onClick: () => setIsSaveModalOpen(false),
					disabled: updateMutation.isPending,
				}}
			>
				<p className="text-mui-text-secondary text-sm">
					This will publish your updated template content to the database immediately and create a history
					audit entry.
				</p>
			</SfiCommonModal>
		</>
	)
}

export default EmailTemplateActions
