'use client'

import { Breadcrumb } from '@/components/navigations/breadcrumb/breadcrumb-base'
import React from 'react'

export type TBreadcrumbItem = {
	label: React.ReactNode
	href?: string
	exact?: boolean
}

export default function BreadcrumbSfi({
	items,
	className,
	separator,
}: {
	items: TBreadcrumbItem[]
	className?: string
	separator?: React.ReactNode
}) {
	return (
		<Breadcrumb className={className} separator={separator}>
			<Breadcrumb.List>
				{items.map((item, idx) => {
					const isLast = idx === items.length - 1

					return (
						<React.Fragment key={`${String(item.href ?? item.label)}-${idx}`}>
							<Breadcrumb.Item>
								{item.href && !isLast ? (
									<Breadcrumb.Link href={item.href} exact={item.exact}>
										{item.label}
									</Breadcrumb.Link>
								) : item.href && isLast ? (
									<Breadcrumb.Link href={item.href} exact={item.exact}>
										{item.label}
									</Breadcrumb.Link>
								) : (
									<Breadcrumb.Page>{item.label}</Breadcrumb.Page>
								)}
							</Breadcrumb.Item>

							{!isLast && <Breadcrumb.Separator />}
						</React.Fragment>
					)
				})}
			</Breadcrumb.List>
		</Breadcrumb>
	)
}
/*
<BreadcrumbSfi
  items={[
    { label: 'Account Application', href: '/account-application' },
    { label: 'Account List' }, // current page
  ]}
/> 
*/
