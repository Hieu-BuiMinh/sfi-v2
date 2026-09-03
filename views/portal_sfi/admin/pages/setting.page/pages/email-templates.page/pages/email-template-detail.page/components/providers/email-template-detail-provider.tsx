'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useEmailTemplate } from '../../hooks/use-email-template'

export interface EmailTemplateFormValues {
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
	registerVisualEditorExporter: (exporter: (() => Promise<void>) | null) => void
	exportVisualEditor: () => Promise<void>
	isSendTestModalOpen: boolean
	setIsSendTestModalOpen: (open: boolean) => void
	editorMode: EmailEditorMode
	setEditorMode: (mode: EmailEditorMode) => void
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
	const [editorMode, setEditorMode] = useState<EmailEditorMode>('visual-builder')
	const form = useForm<EmailTemplateFormValues>({
		defaultValues: {
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
	const visualEditorExporterRef = useRef<(() => Promise<void>) | null>(null)
	const emailTemplate = useEmailTemplate(id)
	const template = emailTemplate.detailQuery.data?.data
	const registerVisualEditorExporter = useCallback((exporter: (() => Promise<void>) | null) => {
		visualEditorExporterRef.current = exporter
	}, [])
	const exportVisualEditor = useCallback(async () => {
		await visualEditorExporterRef.current?.()
	}, [])

	useEffect(() => {
		if (!template) return

		form.reset({
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
	}, [form, template])

	return (
		<EmailTemplateDetailContext.Provider
			value={{
				form,
				registerVisualEditorExporter,
				exportVisualEditor,
				isSendTestModalOpen,
				setIsSendTestModalOpen,
				editorMode,
				setEditorMode,
				...emailTemplate,
			}}
		>
			{children}
		</EmailTemplateDetailContext.Provider>
	)
}

export default EmailTemplateDetailProvider
