import WithdrawalDetailPageView from '@/views/portal_sfi/admin/pages/transactions.page/pages/withdrawal-detail.page'

async function AdminWithdrawalDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="mx-auto w-full max-w-[1550px] p-6">
			<WithdrawalDetailPageView id={id} />
		</div>
	)
}

export default AdminWithdrawalDetailPage
