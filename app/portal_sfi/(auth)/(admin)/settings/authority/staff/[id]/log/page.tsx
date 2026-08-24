import AdminStaffLogPageView from '@/views/portal_sfi/admin/pages/setting.page/admin-authority.page/staff-log.page'
import { redirect } from 'next/navigation'
import React from 'react'

async function AdminStaffLog({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	if (!id) {
		redirect('/not-found')
	}
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<AdminStaffLogPageView id={id} />
		</div>
	)
}

export default AdminStaffLog
