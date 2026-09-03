export function parseSampleData(value: string) {
	try {
		const data = JSON.parse(value) as unknown

		if (typeof data !== 'object' || data === null || Array.isArray(data)) {
			return { data: null, error: 'Mock data root must be a JSON object.' }
		}

		return { data: data as Record<string, unknown>, error: '' }
	} catch (error) {
		return {
			data: null,
			error: `Invalid JSON mock data: ${error instanceof Error ? error.message : 'Unknown error'}`,
		}
	}
}
