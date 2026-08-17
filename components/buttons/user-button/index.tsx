'use client'

import BaseAvatar from '@/components/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/menu/base-menu'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, User } from 'lucide-react'

export type UserButtonProps = {
	mode?: 'light' | 'dark'
}

function SfsUserButton({ mode }: UserButtonProps) {
	const { auth } = useAuth()

	const displayName = auth?.name

	const handleLogout = () => {
		// eslint-disable-next-line @next/next/no-location-assign-relative-destination
		window.location.href = '/auth/logout'
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<BaseAvatar
					src={auth?.picture}
					name={displayName}
					className="cursor-pointer"
					sx={{
						width: 35,
						height: 35,
						fontSize: '0.875rem',
						...(mode === 'dark' && {
							border: '1px solid rgba(255, 255, 255, 0.2)',
						}),
					}}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuItem>
					<User />
					{displayName}
				</DropdownMenuItem>
				<DropdownMenuItem color="error" variant="text" onClick={handleLogout}>
					<LogOut />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default SfsUserButton
