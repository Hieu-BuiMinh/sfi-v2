/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const NAV_SECTIONS = [
	{ key: 'customer-particular', labelKey: 'customer_particulars' },
	{ key: 'regulation-document', labelKey: 'regulation_document' },
]

interface AdminApplicationNavProps {
	applicationId: string | undefined
	nationality: string | undefined
}

export const AdminApplicationNav = ({ applicationId, nationality }: AdminApplicationNavProps) => {
	const t = useTranslations('admin.applications.detail.nav')
	const isForeigner = nationality === 'foreigner'
	const isIndonesian = nationality === 'indonesian'

	const sections = [...NAV_SECTIONS]
	if (isForeigner) {
		sections.push({
			key: 'tax-compliance-declaration',
			labelKey: 'tax_compliance',
		})
	}
	if (isIndonesian) {
		sections.push({
			key: 'privy-ekyc',
			labelKey: 'privy_ekyc',
		})
	}

	if (!applicationId) return null

	return (
		<div className="flex flex-col gap-2.5">
			{sections.map((section) => (
				<Link
					href={`/applications/${applicationId}/${section.key}`}
					key={section.key}
					className="group border-mui-divider bg-mui-bg-paper hover:border-mui-primary-main/40 hover:bg-mui-primary-alpha/5 flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium"
				>
					<span className="text-mui-text-primary group-hover:text-mui-primary transition-colors">
						{t(section.labelKey as any)}
					</span>
					<ArrowForwardIosIcon className="text-mui-primary bg-mui-primary-alpha/10 size-6 rounded-full p-1" />
				</Link>
			))}
		</div>
	)
}
