'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiDebounceTextField from '@/components/inputs/sfi-debounce-textfield'
import SfiSingleSelect from '@/components/inputs/sfi-single-select'
import SfiTabs, { SfiTabItem } from '@/components/tab/sfi-tab-default'
import SfiPageTitle from '@/components/wording/page-title'
import { adminEmailTemplatesService } from '@/services/admin/staffs/email-templates'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { InputAdornment } from '@mui/material'
import EmailTemplatesTable from './components/email-templates-table'
import { useEmailTemplatesTableParams } from './hooks/use-email-templates-table-params'

const tabs: SfiTabItem[] = [
	{ key: 'all', label: 'All', content: null },
	{ key: 'email', label: 'Emails', content: null },
	{ key: 'snippet', label: 'Snippets', content: null },
]

function EmailTemplatesPageView() {
	const [params, setParams] = useEmailTemplatesTableParams()
	const requestParams = {
		page: params.page,
		per_page: params.per_page,
		category: params.category === 'all' ? undefined : params.category,
		language: params.language === 'all' ? undefined : params.language,
		search: params.search ?? undefined,
		sort_by: params.sort_by,
		sort_order: params.sort_order,
		lang: 'en',
	} as const

	const { data: response, isLoading } = useQuery({
		queryKey: adminEmailTemplatesService.getEmailTemplates.key(requestParams),
		queryFn: () => adminEmailTemplatesService.getEmailTemplates.get(requestParams),
		placeholderData: keepPreviousData,
	})

	return (
		<div className="flex flex-col gap-5">
			<BreadcrumbSfi
				items={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'System settings' },
					{ label: 'Email & Notification Templates' },
				]}
			/>

			<SfiPageTitle
				title="Email & Notification Templates"
				subtitle="Dynamic, 100% database-driven template manager with live preview and code editor."
			/>

			<SfiTabs
				items={tabs}
				value={params.category}
				onChange={(category) => setParams({ category: category as 'all' | 'email' | 'snippet', page: 1 })}
				endAdornment={
					<div className="flex items-center gap-2">
						<SfiSingleSelect
							label="Language"
							size="medium"
							value={params.language}
							onChange={(event) =>
								setParams({ language: event.target.value as 'all' | 'eng' | 'idn', page: 1 })
							}
							options={[
								{ label: 'All Languages', value: 'all' },
								{ label: 'English (ENG)', value: 'eng' },
								{ label: 'Indonesian (IDN)', value: 'idn' },
							]}
							sx={{ width: 210 }}
						/>
						<SfiDebounceTextField
							value={params.search ?? ''}
							placeholder="Search templates..."
							size="medium"
							onDebounce={(search) => setParams({ search: search || null, page: 1 })}
							sx={{ width: 280 }}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<SearchRoundedIcon fontSize="small" color="primary" />
										</InputAdornment>
									),
								},
							}}
						/>
					</div>
				}
			/>

			<EmailTemplatesTable
				params={params}
				setParams={setParams}
				rows={response?.data.data ?? []}
				total={response?.data.total ?? 0}
				loading={isLoading}
			/>
		</div>
	)
}

export default EmailTemplatesPageView
