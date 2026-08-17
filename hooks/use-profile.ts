/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { adminMeService } from '@/services/admin/me'
import { IUser } from '@/services/admin/me/me-res.dto'
import { TApiResponse } from '@/dto/types/api.type'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const useProfile = () => {
	const response = useQuery<TApiResponse<IUser>, AxiosError, TApiResponse<IUser>, readonly any[]>({
		queryKey: adminMeService.getUserProfile.key(),
		queryFn: () => adminMeService.getUserProfile.get(),
		refetchOnWindowFocus: true,
		retry: false,
		gcTime: 0,
	})

	return { ...response, user: response.data?.data }
}

export default useProfile
