'use client'

import React, { useState } from 'react'
import {
	Accordion as SfiAccordion,
	AccordionDetails as SfiAccordionDetails,
	AccordionSummary as SfiAccordionSummary,
	Typography,
} from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { cn } from '@/utils/cn'

export interface TCustomerSideMenuItem {
	id: string
	label: string | React.ReactNode
	content: React.ReactNode
	isAction?: boolean
}

export interface TCustomerSideMenuSection {
	title: string
	items: TCustomerSideMenuItem[]
}

interface CustomerSideMenuProps {
	sections: TCustomerSideMenuSection[]
	activeId: string
	onSelect: (id: string) => void
}

const CustomerSideMenu = ({ sections, activeId, onSelect }: CustomerSideMenuProps) => {
	const [expanded, setExpanded] = useState<string | false>('panel-0')

	const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false)
	}

	return (
		<div className="border-mui-divider bg-mui-bg-paper overflow-hidden rounded-xl border">
			{sections.map((section, sectionIdx) => {
				const panelId = `panel-${sectionIdx}`
				const isExpanded = expanded === panelId

				return (
					<SfiAccordion
						key={section.title}
						expanded={isExpanded}
						onChange={handleChange(panelId)}
						disableGutters
						elevation={0}
						square
						className="border-mui-divider m-0! border-b last:border-b-0"
						sx={{
							'&::before': { display: 'none' },
						}}
					>
						<SfiAccordionSummary
							expandIcon={<ExpandMoreRoundedIcon className="text-mui-text-secondary" />}
							className="text-mui-text-primary hover:bg-mui-primary-alpha/5 min-h-11 px-3 font-semibold transition-colors"
							sx={{
								'&.Mui-expanded': { minHeight: 44 },
								'& .MuiAccordionSummary-content': {
									margin: 0,
									'&.Mui-expanded': {
										margin: 0,
									},
								},
							}}
						>
							<Typography className="text-sm font-semibold tracking-wide capitalize">
								{section.title}
							</Typography>
						</SfiAccordionSummary>
						<SfiAccordionDetails className="border-mui-divider flex flex-col gap-1 border-t p-2">
							{section.items.map((item) => {
								const isActive = activeId === item.id && !item.isAction
								return (
									<div
										key={item.id}
										onClick={() => !item.isAction && onSelect(item.id)}
										className={cn(
											'relative flex min-h-10 cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-colors',
											isActive
												? 'bg-mui-primary/10 text-mui-primary font-semibold'
												: 'text-mui-text-secondary hover:text-mui-text-primary',
											item.isAction && 'cursor-default',
											!item.isAction && 'hover:bg-mui-primary/5'
										)}
									>
										{item.label}
										{isActive && (
											<span className="bg-mui-primary absolute top-1/2 right-1 h-5 w-0.75 -translate-y-1/2 rounded-full" />
										)}
									</div>
								)
							})}
						</SfiAccordionDetails>
					</SfiAccordion>
				)
			})}
		</div>
	)
}

export default CustomerSideMenu
