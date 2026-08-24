import AdminCustomerDetailView from '@/views/portal_sfi/admin/pages/customers.page/customer-detail/admin-customer-detail.page'
import React from 'react'

export default async function CustomerDetailPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>
	searchParams: Promise<{ applicationId?: string }>
}) {
	const { id } = await params
	const { applicationId } = await searchParams

	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<AdminCustomerDetailView id={id} applicationId={applicationId || id} />
		</div>
	)
}
