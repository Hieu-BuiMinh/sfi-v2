import { adminEmailTemplatesService } from '@/services/admin/staffs/email-templates'
import {
	TDeleteEmailTemplateAttachmentParams,
	TPreviewEmailTemplateRequest,
	TSendTestEmailRequest,
	TUpdateEmailTemplateRequest,
	TUploadEmailTemplateAttachmentParams,
} from '@/services/admin/staffs/email-templates/email-templates-req.dto'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useEmailTemplate(id: string) {
	const queryClient = useQueryClient()
	const detailQuery = useQuery({
		queryKey: adminEmailTemplatesService.getEmailTemplateDetail.key({ id }),
		queryFn: () => adminEmailTemplatesService.getEmailTemplateDetail.get({ id }),
	})
	const previewMutation = useMutation({
		mutationKey: adminEmailTemplatesService.postPreviewEmailTemplate.key({ id }),
		mutationFn: (body: TPreviewEmailTemplateRequest) =>
			adminEmailTemplatesService.postPreviewEmailTemplate.post({ id, body }),
	})
	const updateMutation = useMutation({
		mutationKey: adminEmailTemplatesService.updateEmailTemplate.key({ id }),
		mutationFn: (body: TUpdateEmailTemplateRequest) =>
			adminEmailTemplatesService.updateEmailTemplate.put({ id, body }),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminEmailTemplatesService.getEmailTemplateDetail.key({ id }),
			}),
	})
	const sendTestEmailMutation = useMutation({
		mutationKey: adminEmailTemplatesService.postSendTestEmail.key({ id }),
		mutationFn: (body: TSendTestEmailRequest) => adminEmailTemplatesService.postSendTestEmail.post({ id, body }),
	})
	const uploadAttachmentMutation = useMutation({
		mutationKey: adminEmailTemplatesService.uploadEmailTemplateAttachment.key({ id }),
		mutationFn: ({ file }: Omit<TUploadEmailTemplateAttachmentParams, 'id'>) =>
			adminEmailTemplatesService.uploadEmailTemplateAttachment.post({ id, file }),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminEmailTemplatesService.getEmailTemplateDetail.key({ id }),
			}),
	})
	const deleteAttachmentMutation = useMutation({
		mutationFn: ({ index }: Omit<TDeleteEmailTemplateAttachmentParams, 'id'>) =>
			adminEmailTemplatesService.deleteEmailTemplateAttachment.delete({ id, index }),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: adminEmailTemplatesService.getEmailTemplateDetail.key({ id }),
			}),
	})

	return {
		detailQuery,
		previewMutation,
		updateMutation,
		sendTestEmailMutation,
		uploadAttachmentMutation,
		deleteAttachmentMutation,
	}
}
