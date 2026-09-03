import EmailBuilder from './email-builder'
import LivePreview from './live-preview'

function EmailWorkspace() {
	return (
		<div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
			<EmailBuilder />
			<LivePreview />
		</div>
	)
}

export default EmailWorkspace
