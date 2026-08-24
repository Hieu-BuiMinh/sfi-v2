'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/menu/base-menu'
import LanguageIcon from '@mui/icons-material/Language'
import { IconButton } from '@mui/material'
import { Check } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

const LANGUAGES = [
	{ locale: 'en', label: 'English' },
	{ locale: 'id', label: 'Bahasa' },
] as const

export default function LangSwitcher() {
	const locale = useLocale()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleChange = (nextLocale: (typeof LANGUAGES)[number]['locale']) => {
		if (nextLocale === locale) return

		// Locale is read by the server layouts on the following refresh.
		// eslint-disable-next-line react-hooks/immutability
		document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`
		startTransition(() => router.refresh())
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<IconButton color="inherit" size="small" disabled={isPending} aria-label="Change language">
					<LanguageIcon fontSize="small" className="text-token-muted-foreground dark:text-mui-text-primary" />
				</IconButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-44">
				{LANGUAGES.map((language) => (
					<DropdownMenuItem
						key={language.locale}
						selected={language.locale === locale}
						onClick={() => handleChange(language.locale)}
					>
						<span className="flex-1">{language.label}</span>
						{language.locale === locale && <Check size={16} />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
