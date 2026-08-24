/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import SfiCheckbox from '@/components/inputs/sfi-checkbox'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { customerApplicationService } from '@/services/customer/applications'
import { CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = '/lib/pdf/pdf.worker.min.js'

const samplePdf = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'

function RegulationDocumentPageView({ id }: { id: string }) {
	const t = useTranslations('customer.regulation_document')
	const [numPages, setNumPages] = useState<number>(0)
	const [_, setLastPageRendered] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const lastPageRef = useRef<HTMLDivElement>(null)

	const { data: appResponse, isLoading } = useQuery({
		queryKey: customerApplicationService.getApplicationById.key({ id }),
		queryFn: () => customerApplicationService.getApplicationById.get({ id }),
	})

	const application = appResponse?.data?.application
	const checked = Boolean(
		application?.content?.confirm_document?.confirm_understand ||
		application?.content?.confirm_document?.confirm_term
	)

	return (
		<div className="flex w-full flex-col gap-4">
			<BreadcrumbSfi
				items={[
					{ label: t('breadcrumb.home'), href: '/my-dashboard' },
					{ label: t('breadcrumb.application_list'), href: '/my-applications' },
					{
						label: t('breadcrumb.application_detail'),
						href: `/my-applications/${id}`,
					},
					{ label: t('breadcrumb.current') },
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
												? containerRef.current.offsetWidth - 48 // padding check
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

export default RegulationDocumentPageView
