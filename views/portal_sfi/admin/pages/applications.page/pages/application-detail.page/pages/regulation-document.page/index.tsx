/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import SfiCheckbox from '@/components/inputs/sfi-checkbox'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import AdminApplicationProvider, {
	useAdminApplication,
} from '@/views/portal_sfi/admin/pages/applications.page/components/application-provider'
import { CircularProgress, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

// Setup PDF worker
const setupPDFWorker = () => {
	if (typeof window === 'undefined') return
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
	if (isIOS) {
		pdfjs.GlobalWorkerOptions.workerSrc = '/lib/pdf/pdf.worker.legacy.min.js'
	} else {
		pdfjs.GlobalWorkerOptions.workerSrc = '/lib/pdf/pdf.worker.min.js'
	}
}

const samplePdf = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'

setupPDFWorker()

function AdminApplicationRegulationDocumentContent({ id }: { id: string }) {
	const t = useTranslations('admin.applications.detail.regulation_document')
	const tb = useTranslations('admin.applications.detail.breadcrumb')
	const [numPages, setNumPages] = useState<number>(0)
	const [_, setLastPageRendered] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const lastPageRef = useRef<HTMLDivElement>(null)
	const [checked, setChecked] = useState(false)

	const { applicationQuery } = useAdminApplication()
	const { data, isLoading } = applicationQuery
	const application = data?.data?.application

	useEffect(() => {
		setChecked(
			application?.content?.confirm_document?.confirm_understand ||
				application?.content?.confirm_document?.confirm_term
		)
	}, [application])

	if (isLoading) {
		return (
			<div className="flex h-96 w-full items-center justify-center">
				<CircularProgress />
			</div>
		)
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: tb('admin'), href: '/dashboard' },
					{ label: tb('application_list'), href: '/applications' },
					{ label: tb('application_detail'), href: `/applications/${id}` },
					{ label: tb('regulation_document') },
				]}
			/>

			<SfiPageTitle title={t('title')} />

			<div className="flex flex-col gap-6">
				<div className="border-mui-divider bg-mui-background-default flex h-[60vh] w-full flex-col items-center overflow-y-auto rounded-lg border py-4">
					{samplePdf ? (
						<Document
							file={samplePdf}
							onLoadSuccess={({ numPages }) => {
								setNumPages(numPages)
								setLastPageRendered(false)
							}}
							loading={
								<div className="flex h-full flex-col items-center justify-center p-10">
									<CircularProgress size={24} />
									<Typography className="text-mui-text-secondary mt-2 text-sm">
										{t('pdf.loading')}
									</Typography>
								</div>
							}
							error={
								<div className="text-mui-error-main flex flex-col items-center justify-center p-10">
									<Typography>{t('pdf.error')}</Typography>
								</div>
							}
						>
							{/* eslint-disable-next-line react-hooks/refs */}
							{Array.from(new Array(numPages), (_, index) => (
								<div
									key={`page_${index + 1}`}
									ref={index === numPages - 1 ? lastPageRef : undefined}
									className="mb-4 shadow-sm last:mb-0"
								>
									<Page
										pageNumber={index + 1}
										renderTextLayer={false}
										renderAnnotationLayer={false}
										onRenderSuccess={() => {
											if (index === numPages - 1) {
												setLastPageRendered(true)
											}
										}}
										width={
											containerRef.current?.offsetWidth
												? containerRef.current.offsetWidth - 48
												: 600
										}
									/>
								</div>
							))}
						</Document>
					) : (
						<div className="flex h-full items-center justify-center">
							<Typography className="text-mui-text-disabled">{t('pdf.no_url')}</Typography>
						</div>
					)}
				</div>

				<SfiCheckbox
					name="confirm_document.confirm_term"
					checked={checked}
					label={<Typography className="text-mui-text-primary text-sm">{t('declaration')}</Typography>}
					disabled
				/>
			</div>
		</div>
	)
}

function AdminApplicationRegulationDocumentPageView({ id }: { id: string }) {
	return (
		<AdminApplicationProvider id={id}>
			<AdminApplicationRegulationDocumentContent id={id} />
		</AdminApplicationProvider>
	)
}

export default AdminApplicationRegulationDocumentPageView
