'use client'

import { Avatar, AvatarProps, SxProps, Theme } from '@mui/material'

interface BaseAvatarProps extends AvatarProps {
	name?: string
	src?: string
	sx?: SxProps<Theme>
}

export const getInitials = (name?: string) => {
	if (!name) return ''
	const parts = name.trim().split(' ')
	if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const BaseAvatar = ({ name, src, sx, ...props }: BaseAvatarProps) => {
	return (
		<Avatar
			src={src}
			alt={name}
			sx={{
				width: 56,
				height: 56,
				fontSize: '1.25rem',
				fontWeight: 500,
				// bgcolor: 'primary.main',
				// color: 'primary.contrastText',
				...sx,
			}}
			{...props}
		>
			{getInitials(name)}
		</Avatar>
	)
}

export default BaseAvatar
