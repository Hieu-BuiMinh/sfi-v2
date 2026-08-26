/* eslint-disable @next/next/no-img-element */

import { CircularProgress } from '@mui/material'

export default function PortalLayoutLoading() {
	return (
		<div className="relative flex h-full w-screen flex-1 items-center justify-center">
			<img
				src="/assets/images/bg/sfi-bg.png"
				alt="portal-home"
				className="absolute inset-0 z-0 h-full w-full object-cover"
			/>
			<div className="relative z-10 flex size-full items-center justify-center">
				<CircularProgress color="inherit" />
			</div>
		</div>
	)
}
