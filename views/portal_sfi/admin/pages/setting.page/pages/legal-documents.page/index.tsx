'use client'

import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { customerSfiService } from '@/services/customer/sfi'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Button, InputAdornment } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import AddLegalDocumentButton from './components/add-legal-document-button'
import LegalDocumentsTable from './components/legal-document-form/legal-documents-table'
import { useLegalDocumentsTableParams } from './hooks/use-legal-documents-table-params'

function LegalDocumentsPageView() {
	const [params, setParams] = useLegalDocumentsTableParams()
	const { data: response, isLoading } = useQuery({
		queryKey: customerSfiService.getTermOfUseTemplateCollection.key(),
		queryFn: customerSfiService.getTermOfUseTemplateCollection.get,
	})

	const filteredDocuments = useMemo(() => {
		const search = params.search?.trim().toLowerCase()
		if (!search) return response?.data ?? []

		return (response?.data ?? []).filter(
			(document) => document.name.toLowerCase().includes(search) || document.slug.toLowerCase().includes(search)
		)
	}, [params.search, response?.data])
	const pageStart = (params.page - 1) * params.per_page
	const rows = filteredDocuments.slice(pageStart, pageStart + params.per_page)

	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'System settings', href: '/settings/authority' },
					{ label: 'Legal Documents' },
				]}
			/>

			<div className="flex items-start justify-between gap-4">
				<SfiPageTitle title="Legal Documents" />
				<AddLegalDocumentButton />
			</div>

			<section className="border-mui-divider bg-mui-background-paper flex flex-col gap-5 rounded-lg border p-5">
				<h2 className="text-sm font-bold">Document Management</h2>
				<div className="flex items-center justify-between gap-4">
					<SfiDebounceTextField
						value={params.search ?? ''}
						placeholder="Search name and slug"
						size="small"
						onDebounce={(search) => setParams({ search: search || null, page: 1 })}
						sx={{ width: 280 }}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position="end">
										<SearchRoundedIcon fontSize="small" />
									</InputAdornment>
								),
							},
						}}
					/>
					<Button variant="outlined" size="small" onClick={() => setParams({ search: null, page: 1 })}>
						Reset
					</Button>
				</div>

				<LegalDocumentsTable
					params={params}
					setParams={setParams}
					rows={rows}
					total={filteredDocuments.length}
					loading={isLoading}
				/>
			</section>
		</div>
	)
}

export default LegalDocumentsPageView
