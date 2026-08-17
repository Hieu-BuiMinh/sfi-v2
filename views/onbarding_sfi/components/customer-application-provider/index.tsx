/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { toastUtil } from '@/utils/toast'
import { adminApplicationService } from '@/services/admin/applications'
import { TApplication } from '@/services/admin/applications/applications-res.dto'
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { createContext, ReactNode, useContext } from 'react'

import { APPLICATION_TYPE } from '@/dto/enums/application'
import { customerApplicationService } from '@/services/customer/applications'
import { TApplicationWorksheet } from '@/services/customer/applications/applications-res.dto'

import { adminKycService } from '@/services/admin/kyc'
import { UploadKycDocumentsRequest, UploadKycJsonRequest } from '@/services/admin/kyc/kyc-req.dto'
import { TKycDocument, TKycDocumentsResponse, TVerifyKycResponse } from '@/services/admin/kyc/kyc-res.dto'
import { TApiResponse } from '@/dto/types/api.type'
import useProfile from '@/hooks/use-profile'

interface CustomerApplicationContextType {
	applicationsQuery: UseQueryResult<TApiResponse<TApplication[]>, Error>
	applicationQuery?: UseQueryResult<
		TApiResponse<{
			application: TApplication
			worksheet?: TApplicationWorksheet
		}>,
		Error
	>
	createApplicationMutation: UseMutationResult<TApiResponse<TApplication[]>, Error, { type: string; slug: string }>
	updateApplicationMutation: UseMutationResult<TApiResponse<TApplication>, Error, { data: TApplication }>
	uploadApplicationDocumentMutation: UseMutationResult<
		any,
		Error,
		{ applicationId: string; typeProof: string; files: File[] }
	>
	deleteApplicationDocumentMutation: UseMutationResult<any, Error, { documentId: string }>
	deleteApplicationMutation: UseMutationResult<any, Error, { id: string | number }>
	kycDocumentsQuery?: UseQueryResult<TKycDocumentsResponse, Error>
	uploadKycDocumentsMutation: UseMutationResult<
		TApiResponse<TKycDocument | TKycDocument[]>,
		Error,
		FormData | UploadKycDocumentsRequest | UploadKycJsonRequest
	>
	verifyKycMutation: UseMutationResult<TVerifyKycResponse, Error, { application_id: string }>
	currentIndiApp?: TApplication
	currentCorpApp?: TApplication
}

export const CustomerApplicationContext = createContext<CustomerApplicationContextType | undefined>(undefined)

export function CustomerApplicationProvider({ children, id }: { children: ReactNode; id?: string }) {
	const { user } = useProfile()
	const queryClient = useQueryClient()

	// NOTE: We are using adminApplicationService here instead of a customer-facing service
	// because of a Backend design issue (the Backend developer implemented these as admin APIs
	// instead of dedicated customer/onboarding routes).
	const applicationsQuery = useQuery({
		queryKey: adminApplicationService.getApplicationsByAuth0Id.key({
			auth0Id: user?.auth0 || '',
		}),
		queryFn: () =>
			adminApplicationService.getApplicationsByAuth0Id.get({
				auth0Id: user?.auth0 || '',
			}),
		enabled: !!user?.auth0,
	})

	const applicationQuery = useQuery({
		queryKey: customerApplicationService.getApplicationById.key({
			id: id || '',
		}),
		queryFn: () =>
			customerApplicationService.getApplicationById.get({
				id: id || '',
			}),
		enabled: !!id,
	})

	// NOTE: adminApplicationService is used here as well due to the same Backend API limitation.
	const createApplicationMutation = useMutation({
		mutationFn: (data: { type: string; slug: string }) => adminApplicationService.createApplication.post(data),
		onSuccess: async () => {
			await queryClient.refetchQueries({
				queryKey: adminApplicationService.getApplicationsByAuth0Id.key({
					auth0Id: user?.auth0 || '',
				}),
			})
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || 'Failed to create application')
		},
	})

	// NOTE: adminApplicationService is used here as well due to the same Backend API limitation.
	const updateApplicationMutation = useMutation({
		mutationFn: (params: { data: TApplication }) => adminApplicationService.updateApplication.post(params),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminApplicationService.getApplicationsByAuth0Id.key({
					auth0Id: user?.auth0 || '',
				}),
			})
			if (id) {
				queryClient.invalidateQueries({
					queryKey: customerApplicationService.getApplicationById.key({
						id,
					}),
				})
			}
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || 'Failed to update application')
		},
	})

	const uploadApplicationDocumentMutation = useMutation({
		mutationFn: async ({
			applicationId,
			typeProof,
			files,
		}: {
			applicationId: string
			typeProof: string
			files: File[]
		}) => {
			const formData = new FormData()
			files.forEach((file, index) => {
				formData.append(`documents[${index}][file]`, file)
			})
			formData.append(`documents[0][type_id]`, typeProof)
			return customerApplicationService.uploadDocument([applicationId], formData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminApplicationService.getApplicationsByAuth0Id.key({
					auth0Id: user?.auth0 || '',
				}),
			})
			if (id) {
				queryClient.invalidateQueries({
					queryKey: customerApplicationService.getApplicationById.key({
						id,
					}),
				})
			}
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || 'Failed to upload document')
		},
	})

	const deleteApplicationDocumentMutation = useMutation({
		mutationFn: async ({ documentId }: { documentId: string }) => {
			return customerApplicationService.deleteDocument(documentId)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminApplicationService.getApplicationsByAuth0Id.key({
					auth0Id: user?.auth0 || '',
				}),
			})
			if (id) {
				queryClient.invalidateQueries({
					queryKey: customerApplicationService.getApplicationById.key({
						id,
					}),
				})
			}
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || 'Failed to delete document')
		},
	})

	const deleteApplicationMutation = useMutation({
		mutationFn: async ({ id }: { id: string | number }) => {
			return adminApplicationService.deleteDraft.delete({ id })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminApplicationService.getApplicationsByAuth0Id.key({
					auth0Id: user?.auth0 || '',
				}),
			})
			toastUtil.success('Application deleted successfully')
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || 'Failed to delete application')
		},
	})

	const kycDocumentsQuery = useQuery({
		queryKey: adminKycService.getKycDocumentsByApplicationId.key({
			applicationId: id || '',
		}),
		queryFn: () =>
			adminKycService.getKycDocumentsByApplicationId.get({
				applicationId: id || '',
			}),
		enabled: !!id,
	})

	const uploadKycDocumentsMutation = useMutation({
		mutationFn: (params: FormData | UploadKycDocumentsRequest | UploadKycJsonRequest) =>
			adminKycService.uploadKycDocuments.post(params),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminKycService.getKycDocumentsByApplicationId.key({
					applicationId: id || '',
				}),
			})
			queryClient.invalidateQueries({
				queryKey: adminApplicationService.getApplicationsByAuth0Id.key({
					auth0Id: user?.auth0 || '',
				}),
			})
			if (id) {
				queryClient.invalidateQueries({
					queryKey: customerApplicationService.getApplicationById.key({
						id,
					}),
				})
			}
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || 'Failed to upload KYC documents')
		},
	})

	const verifyKycMutation = useMutation({
		mutationFn: (body: { application_id: string }) => adminKycService.verifyKyc.post(body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminKycService.getKycDocumentsByApplicationId.key({
					applicationId: id || '',
				}),
			})
			queryClient.invalidateQueries({
				queryKey: adminApplicationService.getApplicationsByAuth0Id.key({
					auth0Id: user?.auth0 || '',
				}),
			})
			if (id) {
				queryClient.invalidateQueries({
					queryKey: customerApplicationService.getApplicationById.key({
						id,
					}),
				})
			}
		},
		onError: (error: any) => {
			toastUtil.error(error?.response?.data?.message || error?.message || 'Failed to verify KYC')
		},
	})

	const applications = applicationsQuery?.data?.data
	const individualAppsSorted = applications
		?.filter((app: any) => app?.type_id === APPLICATION_TYPE.INDIVIDUAL)
		?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
	const currentIndiApp = individualAppsSorted?.[individualAppsSorted.length - 1]

	const corporateAppsSorted = applications
		?.filter((app: any) => app?.type_id === APPLICATION_TYPE.CORPORATE)
		?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
	const currentCorpApp = corporateAppsSorted?.[corporateAppsSorted.length - 1]

	return (
		<CustomerApplicationContext.Provider
			value={{
				applicationsQuery,
				applicationQuery,
				createApplicationMutation,
				updateApplicationMutation,
				uploadApplicationDocumentMutation,
				deleteApplicationDocumentMutation,
				deleteApplicationMutation,
				kycDocumentsQuery,
				uploadKycDocumentsMutation,
				verifyKycMutation,
				currentIndiApp,
				currentCorpApp,
			}}
		>
			{children}
		</CustomerApplicationContext.Provider>
	)
}

export function useCustomerApplication() {
	const context = useContext(CustomerApplicationContext)
	if (!context) {
		throw new Error('useCustomerApplication must be used within a CustomerApplicationProvider')
	}
	return context
}
