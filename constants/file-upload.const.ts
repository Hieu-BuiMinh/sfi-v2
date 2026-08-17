export const FILE_ACCEPT_PRESETS = {
	images: {
		'image/png': ['.png'],
		'image/jpeg': ['.jpg', '.jpeg'],
	},
	documents: {
		'application/pdf': ['.pdf'],
		'image/png': ['.png'],
		'image/jpeg': ['.jpg', '.jpeg'],
	},
	all: {
		'*': [],
	},
}

export const MAX_FILE_SIZE = {
	small: 5 * 1024 * 1024, // 5MB
	medium: 10 * 1024 * 1024, // 10MB
	large: 20 * 1024 * 1024, // 20MB
}
