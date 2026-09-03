import SfiSwitch from '@/components/inputs/sfi-switch'
import SfiTextField from '@/components/inputs/sfi-textfield'

interface EmailTemplateFormEditorProps {
	sampleData: Record<string, unknown>
	onChange: (sampleData: Record<string, unknown>) => void
}

interface EditableField {
	path: string[]
	value: unknown
}

function getEditableFields(value: Record<string, unknown>, prefix: string[] = []): EditableField[] {
	return Object.entries(value).flatMap(([key, fieldValue]) => {
		const path = [...prefix, key]

		if (typeof fieldValue === 'object' && fieldValue !== null && !Array.isArray(fieldValue)) {
			return getEditableFields(fieldValue as Record<string, unknown>, path)
		}

		return [{ path, value: fieldValue }]
	})
}

function EmailTemplateFormEditor({ sampleData, onChange }: EmailTemplateFormEditorProps) {
	const editableFields = getEditableFields(sampleData)

	const updateMockValue = (path: string[], value: unknown) => {
		const nextSampleData = JSON.parse(JSON.stringify(sampleData)) as Record<string, unknown>
		let currentObject = nextSampleData

		path.slice(0, -1).forEach((key) => {
			if (
				typeof currentObject[key] !== 'object' ||
				currentObject[key] === null ||
				Array.isArray(currentObject[key])
			) {
				currentObject[key] = {}
			}

			currentObject = currentObject[key] as Record<string, unknown>
		})

		currentObject[path[path.length - 1]] = value
		onChange(nextSampleData)
	}

	if (!editableFields.length) {
		return (
			<div className="text-mui-text-secondary py-4 text-center text-sm">
				<p>No variables detected in mock data.</p>
				<p>Switch to Raw JSON to add variables.</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{editableFields.map(({ path, value }) => {
				const label = `$${path.join('.')}`

				if (typeof value === 'boolean') {
					return (
						<SfiSwitch
							key={path.join('.')}
							label={label}
							checked={value}
							onChange={(event) => updateMockValue(path, event.target.checked)}
							size="small"
						/>
					)
				}

				if (Array.isArray(value)) {
					return (
						<SfiTextField
							key={path.join('.')}
							label={label}
							value={value.join(',')}
							onChange={(event) => updateMockValue(path, event.target.value.split(','))}
							size="small"
							helperText="Separate values with commas."
						/>
					)
				}

				return (
					<SfiTextField
						key={path.join('.')}
						label={label}
						type={typeof value === 'number' ? 'number' : 'text'}
						value={value === null || value === undefined ? '' : String(value)}
						onChange={(event) =>
							updateMockValue(
								path,
								typeof value === 'number' ? Number(event.target.value) : event.target.value
							)
						}
						size="small"
					/>
				)
			})}
		</div>
	)
}

export default EmailTemplateFormEditor
