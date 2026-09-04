import { useWatch } from 'react-hook-form'
import { useEmailTemplateContext } from '../components/providers/email-template-detail-provider'
import { renderLocalTemplate } from '../utils/render-local-preview'
import { parseSampleData } from '../utils/sample-data'

export function useEmailTemplatePreview() {
	const { form } = useEmailTemplateContext()
	const [subject, to, cc, bcc, bladeContent, sampleDataJson] = useWatch({
		control: form.control,
		name: ['subject', 'to', 'cc', 'bcc', 'blade_content', 'sample_data_json'],
	})

	const parsedSampleData = parseSampleData(sampleDataJson ?? '{}')
	const sampleData = parsedSampleData.data ?? {}
	const renderMetadata = (value: string) => renderLocalTemplate(value, sampleData)

	return {
		html: renderLocalTemplate(bladeContent ?? '', sampleData, true),
		subject: renderMetadata(subject ?? ''),
		to: (to ?? []).map(renderMetadata),
		cc: (cc ?? []).map(renderMetadata),
		bcc: (bcc ?? []).map(renderMetadata),
		error: parsedSampleData.error,
	}
}
