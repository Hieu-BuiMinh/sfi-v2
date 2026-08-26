'use client'

import RfhFileUpload from '@/components/rhf-inputs/rhf-file-upload'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { Button } from '@mui/material'
import { Control, useWatch } from 'react-hook-form'
import type { TLegalDocumentFormValues } from '.'
import { LEGAL_DOCUMENT_MAX_FILE_SIZE } from './legal-document-form.schema'

interface LegalDocumentUploadFieldProps {
	control: Control<TLegalDocumentFormValues>
	currentFileName?: string
}

function LegalDocumentUploadField({ control, currentFileName }: LegalDocumentUploadFieldProps) {
	const document = useWatch({ control, name: 'document' })
	const fileName = document?.file.name || currentFileName

	return (
		<RfhFileUpload
			name="document"
			control={control}
			label={
				<label htmlFor="legal-document-slug" className="text-mui-text-secondary text-sm font-medium">
					Slug<span className="text-mui-error">*</span>
				</label>
			}
			maxSize={LEGAL_DOCUMENT_MAX_FILE_SIZE}
			accept={{
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
			}}
		>
			{({ getRootProps, isDragActive, open }) => (
				<div
					{...getRootProps()}
					className="border-mui-divider bg-mui-bg-default hover:border-mui-primary-main flex min-h-45 cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center"
				>
					<div className="bg-mui-primary/15 text-mui-primary flex size-9 items-center justify-center rounded-full">
						<CloudUploadOutlinedIcon fontSize="small" />
					</div>
					<p className="text-mui-text-secondary text-xs">
						{isDragActive ? 'Drop the file here' : 'Drag and drop your file here or click to browse file'}
					</p>
					<p className="text-mui-text-secondary text-xs">Maximum file size: 10.0 MB</p>
					<Button
						type="button"
						variant="contained"
						size="small"
						onClick={(event) => {
							event.stopPropagation()
							open()
						}}
					>
						Browse file
					</Button>
					{fileName && (
						<p className="text-mui-primary max-w-full truncate text-xs">
							{document ? 'Selected file' : 'Current file'}: {fileName}
						</p>
					)}
				</div>
			)}
		</RfhFileUpload>
	)
}

export default LegalDocumentUploadField
