'use client'

import SfiChipBase, { SfiChipBaseProps } from '@/components/chips/chip-base'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import ReactCountryFlag from 'react-country-flag'

interface EmailTemplateLanguageChipProps extends Omit<SfiChipBaseProps, 'label' | 'variant'> {
	language: string
}

const languageMap: Record<string, { countryCode?: string; label: string }> = {
	eng: { countryCode: 'GB', label: 'ENG' },
	end: { countryCode: 'GB', label: 'ENG' },
	idn: { countryCode: 'ID', label: 'IDN' },
	ind: { countryCode: 'ID', label: 'IDN' },
	all: { label: 'ALL' },
}

function EmailTemplateLanguageChip({ language, ...props }: EmailTemplateLanguageChipProps) {
	const languageConfig = languageMap[language.toLowerCase()]

	return (
		<SfiChipBase
			variant="secondary"
			label={
				<span className="flex items-center gap-1.5">
					{languageConfig.countryCode ? (
						<ReactCountryFlag
							countryCode={languageConfig.countryCode}
							svg
							aria-label={languageConfig.label}
							style={{ width: 16, height: 12 }}
						/>
					) : (
						<PublicRoundedIcon sx={{ fontSize: 14 }} />
					)}
					{languageConfig.label}
				</span>
			}
			{...props}
		/>
	)
}

export default EmailTemplateLanguageChip
