import React from 'react'

function OnboardingFormTitle({ title, subtitle }: { title?: string; subtitle?: string }) {
	if (!title && !subtitle) return null

	return (
		<div className="flex flex-col gap-2">
			{title && <p className="text-xl font-semibold">{title}</p>}

			{subtitle && <p className="text-mui-text-secondary text-sm">{subtitle}</p>}
		</div>
	)
}

export default OnboardingFormTitle
