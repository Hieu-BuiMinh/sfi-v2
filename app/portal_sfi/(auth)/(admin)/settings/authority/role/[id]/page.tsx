import PermissionDetailPageView from '@/views/portal_sfi/admin/pages/setting.page/pages/admin-authority.page/pages/permission-detail.page'
import { redirect } from 'next/navigation'

async function PermissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	if (!id) {
		redirect('/not-found')
	}
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<PermissionDetailPageView id={id} />
		</div>
	)
}

export default PermissionDetailPage
