'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/menu/base-menu'
import { PortalUserRole } from '@/dto/enums/user'
import useProfile from '@/hooks/use-profile'
import { getAppConfig } from '@/utils/get-app-config'
import { IconButton } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function AppSwitcher() {
	const t = useTranslations('components.app_switcher')
	const router = useRouter()
	const { user } = useProfile()

	const handleTrade = () => {
		const tradingPage = getAppConfig().pages?.trading_page
		if (!tradingPage) return

		window.location.assign(tradingPage)
	}

	const handleDashboard = () => {
		router.push(user?.is_staff === PortalUserRole.ADMIN ? '/dashboard' : '/my-dashboard')
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<IconButton size="small" aria-label={t('aria_label')}>
					<GridViewIcon fontSize="small" />
				</IconButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-52">
				<DropdownMenuItem onClick={handleTrade} className="items-start!">
					<div className="flex flex-col">
						<span className="text-sm font-semibold">{t('trade.title')}</span>
						<span className="text-token-muted-foreground text-[11px]">{t('trade.description')}</span>
					</div>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={handleDashboard} className="items-start!">
					<div className="flex flex-col">
						<span className="text-sm font-semibold">{t('dashboard.title')}</span>
						<span className="text-token-muted-foreground text-[11px]">{t('dashboard.description')}</span>
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
