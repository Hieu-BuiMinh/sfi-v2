'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { useEmailTemplate } from '../../hooks/use-email-template'

export interface EmailTemplateFormValues {
	initialized_template_id: string
	initialized_template_updated_at: string
	subject: string
	description: string
	to: string[]
	cc: string[]
	bcc: string[]
	sample_data: Record<string, unknown>
	sample_data_json: string
	blade_content: string
	unlayer_design: Record<string, unknown> | null
}

export type EmailEditorMode = 'visual-builder' | 'code-editor'

type EmailTemplateDetailContextValue = ReturnType<typeof useEmailTemplate> & {
	form: UseFormReturn<EmailTemplateFormValues>
	isFormInitialized: boolean
	registerVisualEditorExporter: (exporter: (() => Promise<void>) | null) => void
	exportVisualEditor: () => Promise<void>
	isSendTestModalOpen: boolean
	setIsSendTestModalOpen: (open: boolean) => void
	isUpdateModalOpen: boolean
	setIsUpdateModalOpen: (open: boolean) => void
	editorMode: EmailEditorMode
	isChangingEditorMode: boolean
	changeEditorMode: (mode: EmailEditorMode) => Promise<void>
	markCodeContentChanged: () => void
	hasCodeContentChanges: () => boolean
	previewRevision: number
}

interface EmailTemplateDetailProviderProps {
	id: string
	children: ReactNode
}

const EmailTemplateDetailContext = createContext<EmailTemplateDetailContextValue | undefined>(undefined)

export function useEmailTemplateContext() {
	const context = useContext(EmailTemplateDetailContext)

	if (!context) {
		throw new Error('useEmailTemplateContext must be used within EmailTemplateDetailProvider')
	}

	return context
}

function EmailTemplateDetailProvider({ id, children }: EmailTemplateDetailProviderProps) {
	const [isSendTestModalOpen, setIsSendTestModalOpen] = useState(false)
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
	const [editorMode, setEditorMode] = useState<EmailEditorMode>('visual-builder')
	const [isChangingEditorMode, setIsChangingEditorMode] = useState(false)
	const [previewRevision, setPreviewRevision] = useState(0)
	const form = useForm<EmailTemplateFormValues>({
		defaultValues: {
			initialized_template_id: '',
			initialized_template_updated_at: '',
			subject: '',
			description: '',
			to: [],
			cc: [],
			bcc: [],
			sample_data: {},
			sample_data_json: '{}',
			blade_content: '',
			unlayer_design: null,
		},
	})
	const initializedTemplateId = useWatch({ control: form.control, name: 'initialized_template_id' })
	const initializedTemplateUpdatedAt = useWatch({
		control: form.control,
		name: 'initialized_template_updated_at',
	})
	const visualEditorExporterRef = useRef<(() => Promise<void>) | null>(null)
	const codeContentChangedRef = useRef(false)
	const emailTemplate = useEmailTemplate(id)
	const template = emailTemplate.detailQuery.data?.data
	const registerVisualEditorExporter = useCallback((exporter: (() => Promise<void>) | null) => {
		visualEditorExporterRef.current = exporter
	}, [])
	const exportVisualEditor = useCallback(async () => {
		await visualEditorExporterRef.current?.()
	}, [])
	const markCodeContentChanged = useCallback(() => {
		codeContentChangedRef.current = true
	}, [])
	const hasCodeContentChanges = useCallback(() => codeContentChangedRef.current, [])
	const changeEditorMode = useCallback(
		async (mode: EmailEditorMode) => {
			if (mode === editorMode || isChangingEditorMode) return

			setIsChangingEditorMode(true)
			try {
				if (editorMode === 'visual-builder') {
					await exportVisualEditor()
				}

				codeContentChangedRef.current = false
				setEditorMode(mode)
				setPreviewRevision((current) => current + 1)
			} finally {
				setIsChangingEditorMode(false)
			}
		},
		[editorMode, exportVisualEditor, isChangingEditorMode]
	)

	useEffect(() => {
		if (
			!template ||
			(initializedTemplateId === template.id && initializedTemplateUpdatedAt === template.updated_at)
		)
			return

		form.reset({
			initialized_template_id: template.id,
			initialized_template_updated_at: template.updated_at,
			subject: template.subject ?? '',
			description: template.description,
			to: template.to,
			cc: template.cc,
			bcc: template.bcc,
			sample_data: template.sample_data ?? {},
			sample_data_json: JSON.stringify(template.sample_data ?? {}, null, 2),
			blade_content: template.blade_content,
			unlayer_design: template.unlayer_design,
		})
		codeContentChangedRef.current = false
	}, [form, initializedTemplateId, initializedTemplateUpdatedAt, template])

	return (
		<EmailTemplateDetailContext.Provider
			value={{
				form,
				isFormInitialized:
					initializedTemplateId === template?.id && initializedTemplateUpdatedAt === template?.updated_at,
				registerVisualEditorExporter,
				exportVisualEditor,
				isSendTestModalOpen,
				setIsSendTestModalOpen,
				isUpdateModalOpen,
				setIsUpdateModalOpen,
				editorMode,
				isChangingEditorMode,
				changeEditorMode,
				markCodeContentChanged,
				hasCodeContentChanges,
				previewRevision,
				...emailTemplate,
			}}
		>
			{children}
		</EmailTemplateDetailContext.Provider>
	)
}

export default EmailTemplateDetailProvider
