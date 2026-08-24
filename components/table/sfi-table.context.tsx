'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { TableParams } from '@/hooks/use-table-params'

export interface SfiTableContextProps {
	params: TableParams
	setParams: (
		values: Partial<TableParams> | ((old: TableParams) => Partial<TableParams>),
		options?:
			| {
					history?: 'replace' | 'push' | undefined
					scroll?: boolean | undefined
					shallow?: boolean | undefined
			  }
			| undefined
	) => Promise<URLSearchParams>
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
