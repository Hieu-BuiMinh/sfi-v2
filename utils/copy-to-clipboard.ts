import toastUtil from './toast'

export async function copyToClipboard(value: string, message = 'Copied to clipboard.') {
	await navigator.clipboard.writeText(value)
	toastUtil.info(message)
}
