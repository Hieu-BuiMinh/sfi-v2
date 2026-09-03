type UnlayerContent = {
	id: string
	type: string
	values: Record<string, unknown>
}

function isUnlayerDesign(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && 'body' in value
}

export function htmlToUnlayerDesign(input: unknown, logoUrl?: string | null): Record<string, unknown> {
	if (isUnlayerDesign(input)) return input

	const html = typeof input === 'string' ? input : ''
	if (html.trim().startsWith('{')) {
		try {
			const parsed: unknown = JSON.parse(html)
			if (isUnlayerDesign(parsed)) return parsed
		} catch {
			// The value is HTML that happens to start with `{`, so continue with HTML conversion.
		}
	}

	const document = new DOMParser().parseFromString(html, 'text/html')
	let root: HTMLElement = document.body
	const wrapperTags = new Set(['DIV', 'TABLE', 'TBODY', 'TR', 'TD'])

	while (root.children.length === 1 && wrapperTags.has(root.children[0].tagName)) {
		root = root.children[0] as HTMLElement
	}

	const contents: UnlayerContent[] = []
	let contentId = 1
	const addBlock = (type: string, values: Record<string, unknown>) => {
		contents.push({ id: `content-${type}-${contentId++}`, type, values })
	}

	const processNode = (node: HTMLElement) => {
		const tag = node.tagName.toLowerCase()
		const text = node.textContent?.trim() ?? ''

		if (tag === 'img') {
			const source = node.getAttribute('src') || logoUrl
			if (!source) return

			const configuredWidth = node.getAttribute('width') || node.style.width || node.style.maxWidth || '150px'
			addBlock('image', {
				containerPadding: '15px 0px 10px 0px',
				src: { url: source },
				altText: node.getAttribute('alt') || 'PAN ASIA Logo',
				width: /^\d+$/.test(configuredWidth) ? `${configuredWidth}px` : configuredWidth,
				autoWidth: false,
				textAlign: 'center',
			})
			return
		}

		if (tag === 'hr') {
			addBlock('divider', {
				containerPadding: '5px 0px 15px 0px',
				border: {
					borderTopStyle: 'solid',
					borderTopWidth: '2px',
					borderTopColor: node.style.borderTopColor || node.style.borderColor || '#158084',
				},
			})
			return
		}

		if (/^h[1-6]$/.test(tag)) {
			addBlock('heading', {
				containerPadding: '14px 0px 6px 0px',
				headingType: tag,
				text,
				textAlign: node.style.textAlign || 'left',
				color: node.style.color || '#111827',
				fontSize: tag === 'h1' ? '22px' : tag === 'h2' ? '18px' : '16px',
				fontWeight: 700,
			})
			return
		}

		if (tag === 'ul' || tag === 'ol') {
			addBlock('text', {
				containerPadding: '6px 0px 10px 0px',
				text: node.outerHTML,
				color: '#374151',
				fontSize: '14px',
				lineHeight: '160%',
			})
			return
		}

		if (tag === 'table') {
			addBlock('html', { containerPadding: '10px 0px', html: node.outerHTML })
			return
		}

		const isButton =
			tag === 'a' &&
			(node.classList.contains('btn') ||
				Boolean(node.style.background || node.style.backgroundColor || node.style.borderRadius))
		if (isButton) {
			addBlock('button', {
				containerPadding: '15px 0px',
				text,
				href: { url: node.getAttribute('href') || '#', target: '_blank' },
				buttonColors: {
					color: node.style.color || '#FFFFFF',
					backgroundColor: node.style.backgroundColor || node.style.background || '#158084',
				},
				textAlign: 'center',
				borderRadius: node.style.borderRadius || '6px',
				padding: '12px 28px',
			})
			return
		}

		if (tag === 'div' && node.children.length > 0) {
			Array.from(node.children).forEach((child) => processNode(child as HTMLElement))
			return
		}

		if (!text) return

		const isShortBoldParagraph =
			tag === 'p' &&
			(Boolean(node.querySelector('b, strong')) || ['bold', '700'].includes(node.style.fontWeight)) &&
			text.length < 70 &&
			!text.includes(',') &&
			!text.endsWith('.')
		if (isShortBoldParagraph) {
			addBlock('heading', {
				containerPadding: '6px 0px',
				headingType: 'h3',
				text,
				color: '#111827',
				fontSize: '16px',
				fontWeight: 700,
			})
			return
		}

		addBlock('text', {
			containerPadding: '6px 0px',
			text: tag === 'div' ? `<p>${text}</p>` : node.outerHTML,
			color: '#374151',
			fontSize: '14px',
			lineHeight: '160%',
		})
	}

	Array.from(root.children).forEach((node) => processNode(node as HTMLElement))

	if (contents.length === 0) {
		addBlock('text', {
			containerPadding: '10px 0px',
			text: html || '<p></p>',
			color: '#374151',
			fontSize: '14px',
			lineHeight: '160%',
		})
	}

	return {
		counters: { u_column: 1, u_row: 1, u_content: contents.length },
		body: {
			id: 'body-container',
			rows: [
				{
					id: 'row-1',
					cells: [1],
					columns: [
						{
							id: 'col-1',
							contents,
							values: { backgroundColor: '#ffffff', padding: '24px 30px', border: {} },
						},
					],
					values: { backgroundColor: '#f9fafb', padding: '20px 0px' },
				},
			],
			values: {
				backgroundColor: '#f9fafb',
				fontFamily: { label: 'Inter', value: 'Inter, Roboto, Arial, sans-serif' },
			},
		},
	}
}
