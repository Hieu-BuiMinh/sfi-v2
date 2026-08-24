/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useMemo, useState } from 'react'
import { Divider, Button } from '@mui/material'
import { TApplication } from '@/services/customer/applications/applications-res.dto'
import { InfoGrid, InfoItem, InfoSection } from '@/views/portal_sfi/customer/components/info-display'
import { getAppConfig } from '@/utils/get-app-config'
import { SFI_DOCUMENT_TYPES } from '@/constants/sfi/document-types.const'
import SfiFilePreviewModal from '@/components/modals/sfi-file-preview-modal'

export type ApplicationDocument = {
	id: string
	type_id: string
	path: string
	url?: string
	document_type?: {
		name: string
		slug: string
	}
}

export type IdentityVerificationData = {
	idCardNumber?: string
	npwpNumber?: string
	applicationDocuments?: ApplicationDocument[]
}

function getDocumentByTypeId(documents: ApplicationDocument[] = [], typeIds: number[]) {
	return documents.find((doc) => typeIds.includes(Number(doc.type_id)))
}

interface DocumentPreviewCardProps {
	label: string
	imageUrl?: string | null
	onView: () => void
	viewLabel: string
	noPreviewLabel: string
}

function DocumentPreviewCard({ label, imageUrl, onView, noPreviewLabel, viewLabel }: DocumentPreviewCardProps) {
	return (
		<div className="group flex flex-col items-center text-center">
			<div className="border-mui-divider bg-mui-bg-default group-hover:border-mui-primary-main relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border transition-all">
				{imageUrl ? (
					<img src={imageUrl} alt={label} className="size-full object-contain p-2" />
				) : (
					<div className="text-mui-text-disabled text-sm">{noPreviewLabel}</div>
				)}
			</div>

			<div className="text-mui-text-secondary mt-4 text-sm font-medium">{label}</div>

			<Button variant="contained" size="small" onClick={onView} disabled={!imageUrl} className="mt-4 min-w-25">
				{viewLabel}
			</Button>
		</div>
	)
}

function IdentityVerification({ application, t }: { application?: TApplication; t: any }) {
	const { api } = getAppConfig()
	const baseImgPath = (img?: string) => (img ? `${api}/storage/${img}` : undefined)
	const iv = application?.content?.customer_particular?.identify_verification || {}

	const data: IdentityVerificationData = useMemo(
		() => ({
			idCardNumber: iv.ktp_or_passport,
			npwpNumber: iv.indonesia_identity_number,
			applicationDocuments: application?.application_documents as any,
		}),
		[application, iv]
	)
	const [preview, setPreview] = useState<{
		open: boolean
		url: string | null
		title: string
	}>({
		open: false,
		url: null,
		title: t('messages.file_preview'),
	})

	const documents = useMemo(() => {
		const docs = data?.applicationDocuments || []

		const ktpFront = getDocumentByTypeId(docs, [SFI_DOCUMENT_TYPES.KTP_FRONT, SFI_DOCUMENT_TYPES.PASSPORT_FRONT])
		const selfie = getDocumentByTypeId(docs, [SFI_DOCUMENT_TYPES.PASSPORT_SELFIE])
		const npwp = getDocumentByTypeId(docs, [SFI_DOCUMENT_TYPES.NPWP])

		return {
			ktpFront: baseImgPath(ktpFront?.path || ktpFront?.url) || null,
			selfie: baseImgPath(selfie?.path || selfie?.url) || null,
			npwp: baseImgPath(npwp?.path || npwp?.url) || null,
		}
	}, [data?.applicationDocuments, baseImgPath])

	const handleOpenPreview = (url: string | null, title: string) => {
		setPreview({ open: true, url, title })
	}

	const handleClosePreview = () => {
		setPreview((prev) => ({ ...prev, open: false }))
	}

	return (
		<div className="flex flex-col gap-8">
			<InfoSection title={t('sections.identity_verification_info')}>
				<InfoGrid className="md:grid-cols-2">
					<InfoItem label={t('fields.id_card_number')} value={data?.idCardNumber} />
					<InfoItem label={t('fields.npwp_number')} value={data?.npwpNumber} />
				</InfoGrid>
			</InfoSection>

			<Divider />

			<InfoSection title={t('sections.verification_documents')}>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
					<DocumentPreviewCard
						label={t('fields.front_side')}
						imageUrl={documents.ktpFront}
						onView={() => handleOpenPreview(documents.ktpFront, t('fields.front_side'))}
						viewLabel={t('actions.view')}
						noPreviewLabel={t('messages.no_preview')}
					/>
					<DocumentPreviewCard
						label={t('fields.selfie')}
						imageUrl={documents.selfie}
						onView={() => handleOpenPreview(documents.selfie, t('fields.selfie_full'))}
						viewLabel={t('actions.view')}
						noPreviewLabel={t('messages.no_preview')}
					/>
					<DocumentPreviewCard
						label={t('fields.npwp_photo')}
						imageUrl={documents.npwp}
						onView={() => handleOpenPreview(documents.npwp, t('fields.npwp_photo_full'))}
						viewLabel={t('actions.view')}
						noPreviewLabel={t('messages.no_preview')}
					/>
				</div>
			</InfoSection>

			<SfiFilePreviewModal
				open={preview.open}
				url={preview.url}
				title={preview.title}
				onClose={handleClosePreview}
				maxWidth="lg"
			/>
		</div>
	)
}

export default IdentityVerification
