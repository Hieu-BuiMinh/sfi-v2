'use client'

import { SfiCollapse } from '@/components/collapse'
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Button, ButtonGroup } from '@mui/material'
import { useState } from 'react'
import { useWatch } from 'react-hook-form'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import { parseSampleData } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/utils/sample-data'
import { useEmailTemplateContext } from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/providers/email-template-detail-provider'
import EmailTemplateFormEditor from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/sections/email-template-advance-edit/form-editor'
import EmailTemplateRawJsonEditor from '@/views/portal_sfi/admin/pages/setting.page/pages/email-templates.page/pages/email-template-detail.page/components/sections/email-template-advance-edit/raw-json-editor'

type EditorMode = 'form' | 'json'

function EmailTemplateAdvanceEdit() {
	const { form } = useEmailTemplateContext()
	const sampleData = useWatch({ control: form.control, name: 'sample_data' })
	const sampleDataJson = useWatch({ control: form.control, name: 'sample_data_json' })
	const [mode, setMode] = useState<EditorMode>('form')

	const updateRawJson = (value: string) => {
		form.setValue('sample_data_json', value, { shouldDirty: true })
		const parsedSampleData = parseSampleData(value)

		if (parsedSampleData.data) {
			form.setValue('sample_data', parsedSampleData.data, { shouldDirty: true })
		}
	}
	const jsonError = parseSampleData(sampleDataJson).error

	return (
		<SfiCollapse
			variant="outline"
			title="Live Preview Variables & Mock Data"
			subtitle="Edit mock data values below to see the live preview rendering in real-time."
			icon={<DataObjectRoundedIcon fontSize="small" />}
			actions={
				<ButtonGroup size="small" variant="outlined">
					<Button
						variant={mode === 'form' ? 'contained' : 'outlined'}
						startIcon={<TuneRoundedIcon fontSize="small" />}
						onClick={() => setMode('form')}
					>
						Form Editor
					</Button>
					<Button
						variant={mode === 'json' ? 'contained' : 'outlined'}
						startIcon={<CodeRoundedIcon fontSize="small" />}
						onClick={() => {
							if (!jsonError) {
								form.setValue(
									'sample_data_json',
									JSON.stringify(form.getValues('sample_data'), null, 2)
								)
							}
							setMode('json')
						}}
					>
						Raw JSON
					</Button>
				</ButtonGroup>
			}
		>
			{mode === 'form' ? (
				<EmailTemplateFormEditor
					sampleData={jsonError ? {} : sampleData}
					onChange={(value) => {
						form.setValue('sample_data', value, { shouldDirty: true })
						form.setValue('sample_data_json', JSON.stringify(value, null, 2), { shouldDirty: true })
					}}
				/>
			) : (
				<EmailTemplateRawJsonEditor value={sampleDataJson} onChange={updateRawJson} error={jsonError} />
			)}
		</SfiCollapse>
	)
}

export default EmailTemplateAdvanceEdit
