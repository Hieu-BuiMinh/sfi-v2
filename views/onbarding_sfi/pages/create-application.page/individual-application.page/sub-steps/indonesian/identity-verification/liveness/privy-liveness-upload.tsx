/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@mui/material'

interface PrivyLivenessUploadProps {
	previewUrl?: string
	disabled: boolean
	onStart: () => void
}

export default function PrivyLivenessUpload({ previewUrl, disabled, onStart }: PrivyLivenessUploadProps) {
	return (
		<div className="flex h-full w-full flex-1 flex-col">
			<label className="text-mui-text-secondary mb-2 text-sm font-medium">Selfie with your KTP</label>
			<div className="border-mui-divider hover:border-mui-primary flex-1 rounded-lg border p-8 text-center transition-colors">
				<div className="relative flex h-full flex-1 flex-col justify-between">
					{previewUrl ? (
						<div className="flex h-44 w-full items-center justify-center overflow-hidden rounded">
							<img src={previewUrl} alt="Liveness selfie" className="size-full rounded object-cover" />
						</div>
					) : (
						<div className="bg-mui-action-hover h-44 w-full rounded" />
					)}

					<div className="text-mui-text-secondary flex flex-col items-center gap-1 text-xs">
						<p className="text-mui-text-secondary my-1 text-base">Selfie with your KTP</p>
						<p>Live facial camera verification required</p>
						<div className="mt-2 flex items-center justify-center">
							<Button variant="contained" onClick={onStart} disabled={disabled}>
								{disabled ? 'Processing...' : 'Start Face Scan'}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
