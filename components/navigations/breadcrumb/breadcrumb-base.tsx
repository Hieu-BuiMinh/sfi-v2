/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

type BreadcrumbContextValue = {
	pathname: string
	separator: React.ReactNode
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue | null>(null)

function useBreadcrumbCtx() {
	const ctx = React.useContext(BreadcrumbContext)
	if (!ctx) throw new Error('Breadcrumb components must be used within <Breadcrumb />')
	return ctx
}

function normalizePath(p?: string) {
	if (!p) return ''
	const clean = p.split('?')[0].split('#')[0]
	if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1)
	return clean
}

function isActivePath(pathname: string, href?: string, exact: boolean = true) {
	if (!href) return false
	const p = normalizePath(pathname)
	const h = normalizePath(href)
	if (!h) return false
	if (exact) return p === h
	return p === h || p.startsWith(h + '/')
}

type BreadcrumbRootProps = {
	separator?: React.ReactNode
	className?: string
	children: React.ReactNode
}

function BreadcrumbRoot({
	separator = <KeyboardArrowRightIcon fontSize="small" />,
	className = '',
	children,
}: BreadcrumbRootProps) {
	const pathname = usePathname()

	const value = React.useMemo(() => ({ pathname, separator }), [pathname, separator])

	return (
		<BreadcrumbContext.Provider value={value}>
			<nav aria-label="Breadcrumb" className={className}>
				{children}
			</nav>
		</BreadcrumbContext.Provider>
	)
}

type ListProps = React.ComponentPropsWithoutRef<'ol'>
function BreadcrumbList({ className = '', ...props }: ListProps) {
	return (
		<ol
			className={`text-text-secondary flex flex-wrap items-center gap-2 overflow-x-auto text-sm ${className}`}
			{...props}
		/>
	)
}

type ItemProps = React.ComponentPropsWithoutRef<'li'> & {
	href?: string
	exact?: boolean
}
function BreadcrumbItem({ className = '', children, ...props }: ItemProps) {
	return (
		<li className={`flex items-center gap-2 ${className}`} {...props}>
			{children}
		</li>
	)
}

type LinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
	exact?: boolean
	activeClassName?: string
	inactiveClassName?: string
}
function BreadcrumbLink({
	href,
	exact,
	className = '',
	activeClassName = 'text-text-primary font-medium',
	inactiveClassName = 'hover:text-text-primary transition-colors',
	children,
	...props
}: LinkProps) {
	const { pathname } = useBreadcrumbCtx()
	const active = isActivePath(pathname, typeof href === 'string' ? href : href.toString(), exact)

	if (active) {
		return (
			<span className={`${activeClassName} ${className}`} aria-current="page">
				{children}
			</span>
		)
	}

	return (
		<Link href={href} className={`${inactiveClassName} ${className}`} {...props}>
			{children}
		</Link>
	)
}

type PageProps = React.ComponentPropsWithoutRef<'span'>
function BreadcrumbPage({ className = '', ...props }: PageProps) {
	return <span aria-current="page" className={`text-text-primary font-medium ${className}`} {...props} />
}

type SeparatorProps = {
	icon?: React.ReactNode
} & React.ComponentPropsWithoutRef<'span'>
function BreadcrumbSeparator({ className = '', children, icon, ...props }: SeparatorProps) {
	const { separator } = useBreadcrumbCtx()
	return (
		<span className={`text-text-disabled select-none ${className}`} {...props}>
			{icon ?? separator}
		</span>
	)
}

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
	List: BreadcrumbList,
	Item: BreadcrumbItem,
	Link: BreadcrumbLink,
	Page: BreadcrumbPage,
	Separator: BreadcrumbSeparator,
})

/**

<Breadcrumb className="mb-3">
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/account-application">Account Application</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Account List</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb>

 */
