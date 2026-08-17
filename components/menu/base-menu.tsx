/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import { cn } from '@/utils/cn'

interface DropdownMenuContextType {
	open: boolean
	anchorEl: HTMLElement | null
	setAnchorEl: (el: HTMLElement | null) => void
	close: () => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
	const open = Boolean(anchorEl)

	const close = React.useCallback(() => {
		setAnchorEl(null)
	}, [])

	return (
		<DropdownMenuContext.Provider value={{ open, anchorEl, setAnchorEl, close }}>
			{children}
		</DropdownMenuContext.Provider>
	)
}

export function useDropdownMenu() {
	const context = React.useContext(DropdownMenuContext)
	if (!context) {
		throw new Error('useDropdownMenu must be used within a DropdownMenu')
	}
	return context
}

export interface DropdownMenuTriggerProps {
	asChild?: boolean
	children: React.ReactNode
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
	({ asChild, children, ...props }, ref) => {
		const { setAnchorEl, open } = useDropdownMenu()

		const handleClick = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorEl(event.currentTarget)
			if (React.isValidElement(children) && (children.props as any).onClick) {
				;(children.props as any).onClick(event)
			}
		}

		if (asChild && React.isValidElement(children)) {
			return React.cloneElement(children as React.ReactElement<any>, {
				...props,
				onClick: handleClick,
				'aria-haspopup': 'true',
				'aria-expanded': open ? 'true' : undefined,
			})
		}

		return (
			<button ref={ref} onClick={handleClick} {...props}>
				{children}
			</button>
		)
	}
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export interface DropdownMenuContentProps extends Omit<MenuProps, 'open' | 'anchorEl' | 'onClose'> {
	className?: string
}

export function DropdownMenuContent({
	children,
	className,
	transformOrigin = { horizontal: 'center', vertical: 'top' },
	anchorOrigin = { horizontal: 'center', vertical: 'bottom' },
	...props
}: DropdownMenuContentProps) {
	const { open, anchorEl, close } = useDropdownMenu()

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={close}
			autoFocus={false}
			disableAutoFocusItem={true}
			slotProps={{
				paper: {
					className: cn(
						'min-w-[10rem] overflow-hidden rounded-xl border border-mui-divider bg-mui-bg-paper p-1 text-token-foreground shadow-2xl backdrop-blur-xl',
						className
					),
					sx: {
						marginTop: '6px',
						boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
						'& .MuiList-root': {
							padding: 0,
						},
					},
				},
			}}
			transformOrigin={transformOrigin}
			anchorOrigin={anchorOrigin}
			{...props}
		>
			{children}
		</Menu>
	)
}

export interface DropdownMenuItemProps extends Omit<MenuItemProps, 'color'> {
	className?: string
	variant?: 'text' | 'outlined' | 'contained' | 'ghost'
	color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'white'
}

export function DropdownMenuItem({
	children,
	className,
	onClick,
	variant = 'text',
	color,
	sx,
	...props
}: DropdownMenuItemProps) {
	const { close } = useDropdownMenu()
	const theme = useTheme()

	const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
		onClick?.(event)
		if (!event.defaultPrevented) {
			close()
		}
	}

	const getSxStyles = () => {
		if (!color || color === 'inherit') return {}

		if (color === 'error') {
			return {
				color: '#f87171 !important',
				'& svg': {
					color: '#f87171 !important',
				},
				'&:hover, &.Mui-focusVisible, &:focus': {
					backgroundColor: 'rgba(239, 68, 68, 0.12) !important',
					color: '#f87171 !important',
				},
			}
		}

		if (color === 'white') {
			return {
				color: '#ffffff !important',
				'& svg': {
					color: '#ffffff !important',
				},
				'&:hover, &.Mui-focusVisible, &:focus': {
					backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
				},
			}
		}

		const paletteColor = (theme.palette as any)[color]
		if (!paletteColor) return {}

		if (variant === 'contained') {
			return {
				backgroundColor: `${paletteColor.main} !important`,
				color: `${paletteColor.contrastText} !important`,
				'&:hover, &.Mui-focusVisible, &:focus': {
					backgroundColor: `${paletteColor.dark} !important`,
				},
				'& svg': {
					color: 'inherit !important',
				},
			}
		}

		if (variant === 'outlined') {
			return {
				border: `1px solid ${paletteColor.main} !important`,
				color: `${paletteColor.main} !important`,
				backgroundColor: 'transparent !important',
				'&:hover, &.Mui-focusVisible, &:focus': {
					backgroundColor: `${paletteColor.main}1a !important`,
				},
				'& svg': {
					color: 'inherit !important',
				},
			}
		}

		return {
			color: `${paletteColor.main} !important`,
			'&:hover, &.Mui-focusVisible, &:focus': {
				backgroundColor: `${paletteColor.main}1a !important`,
			},
			'& svg': {
				color: 'inherit !important',
			},
		}
	}

	const renderedChildren = React.Children.map(children, (child) => {
		if (typeof child === 'string' || typeof child === 'number') {
			return <span className="flex-1 truncate text-left">{child}</span>
		}
		return child
	})

	return (
		<MenuItem
			onClick={handleClick}
			className={cn(
				'relative flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors outline-none select-none',
				'text-token-foreground hover:bg-mui-action-hover focus:bg-mui-action-hover',
				'data-disabled:pointer-events-none data-disabled:opacity-50',
				'[&_svg]:text-token-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
				className
			)}
			sx={[getSxStyles(), ...(Array.isArray(sx) ? sx : [sx || {}])]}
			{...props}
		>
			{renderedChildren}
		</MenuItem>
	)
}

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string
	inset?: boolean
}

export function DropdownMenuLabel({ className, inset, ...props }: DropdownMenuLabelProps) {
	return (
		<div
			className={cn('text-token-foreground px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
			{...props}
		/>
	)
}

export interface DropdownMenuSeparatorProps {
	className?: string
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
	return <Divider className={cn('border-mui-divider/50 bg-mui-divider -mx-1 my-1 h-px', className)} />
}

export function DropdownMenuGroup({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn('flex flex-col gap-0.5', className)} {...props}>
			{children}
		</div>
	)
}

/* Quick Wrapper Component */
export interface BaseDropdownMenuItem {
	key: string
	label: React.ReactNode
	icon?: React.ReactNode
	divider?: boolean
	onClick?: () => void
	color?: DropdownMenuItemProps['color']
	variant?: DropdownMenuItemProps['variant']
}

export interface BaseDropdownMenuProps {
	renderTrigger: (props: { onClick: (e: React.MouseEvent<HTMLElement>) => void }) => React.ReactNode
	items: BaseDropdownMenuItem[]
	className?: string
}

export function BaseDropdownMenu({ renderTrigger, items, className }: BaseDropdownMenuProps) {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
	const open = Boolean(anchorEl)

	const handleClose = () => setAnchorEl(null)

	return (
		<>
			{renderTrigger({
				onClick: (e) => setAnchorEl(e.currentTarget),
			})}
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				autoFocus={false}
				disableAutoFocusItem={true}
				slotProps={{
					paper: {
						className: cn(
							'min-w-[10rem] overflow-hidden rounded-xl border border-mui-divider bg-mui-bg-paper p-1 text-token-foreground shadow-2xl backdrop-blur-xl',
							className
						),
						sx: {
							marginTop: '6px',
							boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
							'& .MuiList-root': {
								padding: 0,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: 'center', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
			>
				{items.map((item) => (
					<React.Fragment key={item.key}>
						<DropdownMenuItem
							color={item.color}
							variant={item.variant}
							onClick={() => {
								item.onClick?.()
								handleClose()
							}}
						>
							{item.icon}
							{item.label}
						</DropdownMenuItem>
						{item.divider && <DropdownMenuSeparator />}
					</React.Fragment>
				))}
			</Menu>
		</>
	)
}

export default BaseDropdownMenu
