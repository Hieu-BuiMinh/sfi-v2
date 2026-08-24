'use client'

import AppSwitcher from '@/components/buttons/app-switcher'
import LangSwitcher from '@/components/buttons/lang-switcher'
import ModeToggle from '@/components/buttons/mode-toggle'
import UserButton from '@/components/buttons/user-button'
import { SidebarToggleButton } from '@/components/navigations/sidebar'
import SfiNotiButton from '@/components/notification/noti-button'

export default function PortalNavbar() {
	return (
		<header className="border-mui-divider bg-mui-bg-default sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4">
			<SidebarToggleButton className="sm:hidden" />
			<div className="ml-auto flex items-center gap-3">
				<ModeToggle />
				<SfiNotiButton />
				<LangSwitcher />
				<AppSwitcher />
				<UserButton />
			</div>
		</header>
	)
}
