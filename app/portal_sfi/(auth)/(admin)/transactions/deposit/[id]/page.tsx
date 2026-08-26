import DepositDetailPageView from '@/views/portal_sfi/admin/pages/transactions.page/pages/deposit-detail.page'

async function AdminDepositDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<DepositDetailPageView id={id} />
		</div>
	)
}

export default AdminDepositDetailPage
