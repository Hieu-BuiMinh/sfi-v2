import AdminApplicationPrivyEkycPageView from '@/views/portal_sfi/admin/pages/applications.page/application-detail/privy-ekyc/privy-ekyc.page'

async function AdminApplicationPrivyEkycPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<AdminApplicationPrivyEkycPageView id={id} />
		</div>
	)
}

export default AdminApplicationPrivyEkycPage
