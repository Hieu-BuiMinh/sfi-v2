const DATA_EXPRESSION = /\{\{\s*\$data\[['"]([^'"]+)['"]\]\s*\}\}/g

function escapeHtml(value: unknown) {
	return String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;')
}

export function renderLocalTemplate(content: string, sampleData: Record<string, unknown>, escapeValues = false) {
	return content.replace(DATA_EXPRESSION, (_, key: string) => {
		const value = sampleData[key]
		return escapeValues ? escapeHtml(value) : String(value ?? '')
	})
}
