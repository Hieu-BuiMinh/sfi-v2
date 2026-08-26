'use client'

import { adminEmailTemplatesService } from '@/services/admin/staffs/email-templates'
import { TEmailTemplateDetail } from '@/services/admin/staffs/email-templates/email-templates-res.dto'
import { useQuery } from '@tanstack/react-query'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

export interface EmailTemplateFormValues {
	subject: string
	description: string
	to: string[]
	cc: string[]
	bcc: string[]
}

interface EmailTemplateDetailContextValue {
	template: TEmailTemplateDetail | undefined
	isLoading: boolean
	form: UseFormReturn<EmailTemplateFormValues>
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
	const form = useForm<EmailTemplateFormValues>({
		defaultValues: {
			subject: '',
			description: '',
			to: [],
			cc: [],
			bcc: [],
		},
	})
	const { data: response, isLoading } = useQuery({
		queryKey: adminEmailTemplatesService.getEmailTemplateDetail.key({ id }),
		queryFn: () => adminEmailTemplatesService.getEmailTemplateDetail.get({ id }),
	})
	const template = response?.data

	useEffect(() => {
		if (!template) return

		form.reset({
			subject: template.subject ?? '',
			description: template.description,
			to: template.to,
			cc: template.cc,
			bcc: template.bcc,
		})
	}, [form, template])

	return (
		<EmailTemplateDetailContext.Provider value={{ template, isLoading, form }}>
			{children}
		</EmailTemplateDetailContext.Provider>
	)
}

export default EmailTemplateDetailProvider
