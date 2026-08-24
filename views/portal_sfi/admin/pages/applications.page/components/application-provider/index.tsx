'use client'

import { TApiResponse } from '@/dto/types/api.type'
import { adminApplicationService } from '@/services/admin/applications'
import { TApplicationDetailResponse } from '@/services/admin/applications/applications-res.dto'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import React, { createContext, useContext, useMemo } from 'react'

interface AdminApplicationContextType {
	applicationQuery: UseQueryResult<TApiResponse<TApplicationDetailResponse>, Error>
}

const AdminApplicationContext = createContext<AdminApplicationContextType | undefined>(undefined)

export const useAdminApplication = () => {
	const context = useContext(AdminApplicationContext)
	if (!context) {
		throw new Error('useAdminApplication must be used within an AdminApplicationProvider')
	}
	return context
}

function AdminApplicationProvider({ children, id }: { children: React.ReactNode; id: string }) {
	const applicationQuery = useQuery({
		queryKey: adminApplicationService.getApplicationById.key(id),
		queryFn: () => adminApplicationService.getApplicationById.get(id),
		enabled: !!id,
	})

	const value = useMemo(() => ({ applicationQuery }), [applicationQuery])

	return <AdminApplicationContext.Provider value={value}>{children}</AdminApplicationContext.Provider>
}

export default AdminApplicationProvider
