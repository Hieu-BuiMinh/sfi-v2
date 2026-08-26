'use client'

import React, { createContext, useContext, ReactNode } from 'react'

export interface SfiTableParams {
	page: number
	per_page: number
	sort_by?: string | null
	sort_order?: 'asc' | 'desc' | null
}

export type SfiTableParamsSetter = (
	values: Partial<SfiTableParams>,
	options?: {
		history?: 'replace' | 'push'
		scroll?: boolean
		shallow?: boolean
	}
) => Promise<URLSearchParams>

export interface SfiTableContextProps {
	params: SfiTableParams
	setParams: SfiTableParamsSetter
	rowCount: number
	loading?: boolean
}

const SfiTableContext = createContext<SfiTableContextProps | undefined>(undefined)

export const useSfiTableContext = () => {
	return useContext(SfiTableContext)
}

export interface SfiTableProviderProps extends SfiTableContextProps {
	children: ReactNode
}

export const SfiTableProvider = ({ children, ...props }: SfiTableProviderProps) => {
	return (
		<SfiTableContext.Provider value={props}>
			<div className="flex w-full flex-col gap-2 overflow-x-hidden">{children}</div>
		</SfiTableContext.Provider>
	)
}
