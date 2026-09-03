'use client'

import toastUtil from '@/utils/toast'
import { SfiCollapse } from '@/components/collapse'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import { Button, IconButton } from '@mui/material'
import { ChangeEvent, useRef } from 'react'
import { useEmailTemplateContext } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/providers/email-template-detail-provider'

function EmailTemplatePdfAttachment() {
	const inputRef = useRef<HTMLInputElement>(null)
	const { detailQuery, uploadAttachmentMutation, deleteAttachmentMutation } = useEmailTemplateContext()
	const template = detailQuery.data?.data

	if (!template || template.category !== 'email') return null

	const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		try {
			const response = await uploadAttachmentMutation.mutateAsync({ file })
			toastUtil.success(response.message)
		} catch {
			toastUtil.error('Failed to upload attachment.')
		} finally {
			event.target.value = ''
		}
	}

	const handleDelete = async (index: number) => {
		try {
			const response = await deleteAttachmentMutation.mutateAsync({ index })
			toastUtil.success(response.message)
		} catch {
			toastUtil.error('Failed to delete attachment.')
		}
	}

	return (
		<SfiCollapse
			title="Email PDF Attachments"
			subtitle="Attach static files (PDFs, guides, disclaimers) to be sent automatically with this email template."
			icon={<AttachFileRoundedIcon fontSize="small" />}
			badge={template.attachments?.length ?? 0}
		>
			<div className="flex justify-end">
				<Button
					variant="outlined"
					size="small"
					startIcon={<UploadFileRoundedIcon />}
					onClick={() => inputRef.current?.click()}
					loading={uploadAttachmentMutation.isPending}
					disabled={deleteAttachmentMutation.isPending}
				>
					Upload PDF
				</Button>
				<input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" onChange={handleUpload} />
			</div>

			{template.attachments?.length ? (
				<div className="mt-4 flex flex-col gap-2">
					{template.attachments.map((attachment, index) => (
						<div
							key={`${attachment.path}-${index}`}
							className="border-mui-divider flex items-center justify-between gap-3 rounded-md border p-3"
						>
							<div className="min-w-0">
								<p className="text-mui-text-primary truncate text-sm font-medium">{attachment.name}</p>
								<p className="text-mui-text-secondary text-xs">
									{attachment.size < 1024 * 1024
										? `${(attachment.size / 1024).toFixed(2)} KB`
										: `${(attachment.size / (1024 * 1024)).toFixed(2)} MB`}
								</p>
							</div>
							<IconButton
								color="error"
								size="small"
								onClick={() => handleDelete(index)}
								disabled={uploadAttachmentMutation.isPending || deleteAttachmentMutation.isPending}
								aria-label={`Delete ${attachment.name}`}
							>
								<DeleteOutlineRoundedIcon fontSize="small" />
							</IconButton>
						</div>
					))}
				</div>
			) : (
				<p className="text-mui-text-secondary mt-4 text-sm">No PDF attachments.</p>
			)}
		</SfiCollapse>
	)
}

export default EmailTemplatePdfAttachment
