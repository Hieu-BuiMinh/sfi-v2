'use client'

import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { customerSfiService } from '@/services/customer/sfi'
import { TLegalDocumentTemplate } from '@/services/customer/sfi/term-of-use-res.dto'
import { formatDate } from '@/utils/dayjs'
import toast from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import LegalDocumentUploadField from './legal-document-upload-field'
import {
	getLegalDocumentFormSchema,
	LEGAL_DOCUMENT_SLUGS,
	TLegalDocumentFormValues,
} from './legal-document-form.schema'

export type { TLegalDocumentFormValues } from './legal-document-form.schema'

const LEGAL_DOCUMENT_SLUG_OPTIONS = LEGAL_DOCUMENT_SLUGS.map((slug) => ({ label: slug, value: slug }))

interface LegalDocumentFormProps {
	detail?: TLegalDocumentTemplate
	loading?: boolean
}

function LegalDocumentForm({ detail, loading }: LegalDocumentFormProps) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const [uploadProgress, setUploadProgress] = useState<number | null>(null)
	const { control, handleSubmit, reset } = useForm<TLegalDocumentFormValues>({
		resolver: zodResolver(getLegalDocumentFormSchema(Boolean(detail))),
		defaultValues: { name: '', slug: '', document: null },
	})
	const document = useWatch({ control, name: 'document' })

	useEffect(() => {
		if (detail) {
			reset({ name: detail.name, slug: detail.slug, document: null })
		}
	}, [detail, reset])

	const currentFileName = detail?.s3_versions[0]?.s3_key.split('/').at(-1)
	const mutation = useMutation({
		mutationFn: async (data: TLegalDocumentFormValues) => {
			let uploadId: string | undefined
			let uploadCompleted = false

			try {
				if (data.document) {
					const file = data.document.file
					const initResponse = await customerSfiService.initTermOfUseTemplateChunkedUpload.post({
						filename: file.name,
						filesize: file.size,
						mimeType:
							file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					})
					const sessionUploadId = initResponse.data.uploadId
					uploadId = sessionUploadId

					const { chunkSize, totalChunks } = initResponse.data
					const statusResponse = await customerSfiService.getTermOfUseTemplateChunkedUploadStatus.get({
						uploadId: sessionUploadId,
					})
					const uploadedChunks = new Set(statusResponse.data.uploaded)
					const remainingChunks = Array.from({ length: totalChunks }, (_, index) => index).filter(
						(index) => !uploadedChunks.has(index)
					)
					let uploadedCount = uploadedChunks.size
					let nextChunk = 0

					setUploadProgress(Math.round((uploadedCount / totalChunks) * 100))
					await Promise.all(
						Array.from({ length: Math.min(3, remainingChunks.length) }, async () => {
							while (nextChunk < remainingChunks.length) {
								const chunkIndex = remainingChunks[nextChunk++]
								const start = chunkIndex * chunkSize
								const chunk = file.slice(start, Math.min(start + chunkSize, file.size))

								await customerSfiService.uploadTermOfUseTemplateChunk.post({
									uploadId: sessionUploadId,
									chunkIndex,
									totalChunks,
									chunk,
								})
								uploadedCount += 1
								setUploadProgress(Math.round((uploadedCount / totalChunks) * 100))
							}
						})
					)

					await customerSfiService.completeTermOfUseTemplateChunkedUpload.post({
						uploadId: sessionUploadId,
					})
					uploadCompleted = true
				}

				if (detail) {
					return customerSfiService.updateTermOfUseTemplate.post({
						name: data.name,
						slug: data.slug,
						uploadId,
					})
				}

				return customerSfiService.createTermOfUseTemplate.post({
					name: data.name,
					slug: data.slug,
					uploadId: uploadId!,
				})
			} catch (error) {
				if (uploadId && !uploadCompleted) {
					await customerSfiService.cancelTermOfUseTemplateChunkedUpload
						.delete({ uploadId })
						.catch(() => undefined)
				}
				throw error
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: customerSfiService.getTermOfUseTemplateCollection.key(),
			})
			toast.success(detail ? 'Template updated successfully' : 'Template uploaded successfully')
			router.push('/settings/legal-documents')
		},
		onError: (error) => {
			const message = axios.isAxiosError<{ message?: string }>(error)
				? error.response?.data?.message || error.message
				: error instanceof Error
					? error.message
					: 'Failed to upload template'
			toast.error(message)
		},
		onSettled: () => setUploadProgress(null),
	})

	return (
		<form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-5">
			<fieldset
				disabled={loading || mutation.isPending}
				className="border-mui-divider grid grid-cols-1 gap-6 rounded-lg border p-5 lg:grid-cols-2"
			>
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2">
						<label htmlFor="legal-document-name" className="text-mui-text-secondary text-sm font-medium">
							Name<span className="text-mui-error">*</span>
						</label>
						<RfhSfiTextField
							id="legal-document-name"
							name="name"
							control={control}
							placeholder="Input Name"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="legal-document-slug" className="text-mui-text-secondary text-sm font-medium">
							Slug<span className="text-mui-error">*</span>
						</label>
						<RfhSfiSingleSelect
							id="legal-document-slug"
							name="slug"
							control={control}
							placeholder="Select a slug"
							options={LEGAL_DOCUMENT_SLUG_OPTIONS}
							fullWidth
							disabled={Boolean(detail)}
						/>
					</div>
					<div className="grid grid-cols-[140px_1fr] items-center gap-4">
						<span className="text-mui-text-secondary text-sm font-medium">Last Modified at</span>
						<span className="text-mui-text-primary text-sm">
							{detail ? formatDate(detail.updated_at, 'ddd MMM DD YYYY HH:mm (UTCZ)') : '-'}
						</span>
					</div>

					<div className="grid grid-cols-[140px_1fr] items-center gap-4">
						<span className="text-mui-text-secondary text-sm font-medium">Size</span>
						<span className="text-mui-text-primary text-sm">
							{document
								? `${(document.file.size / 1024).toFixed(2)} KB`
								: detail
									? `${(Number(detail.size) / 1024).toFixed(2)} KB`
									: '-'}
						</span>
					</div>
				</div>

				<LegalDocumentUploadField control={control} currentFileName={currentFileName} />
			</fieldset>

			<div className="flex justify-end">
				<Button type="submit" variant="contained" loading={mutation.isPending} disabled={loading}>
					{uploadProgress !== null
						? `Uploading ${uploadProgress}%`
						: mutation.isPending
							? 'Saving'
							: detail
								? 'Update'
								: 'Upload'}
				</Button>
			</div>
		</form>
	)
}

export default LegalDocumentForm
