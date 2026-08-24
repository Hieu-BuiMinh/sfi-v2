import PaymentMethodDetailPageView from '@/views/portal_sfi/admin/pages/payments.page/payment-method-detail/payment-method-detail.page'

async function PaymentMethodDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	return (
		<div className="w-full max-w-3xl p-6">
			<PaymentMethodDetailPageView id={id} />
		</div>
	)
}

export default PaymentMethodDetailPage
