/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { TApplication } from '@/services/customer/applications/applications-res.dto'
import { InfoGrid, InfoItem, InfoSection } from '@/views/portal_sfi/customer/components/info-display'

export type BankAccountData = {
	bankName?: string
	accountHolderName?: string
	accountNumber?: string
}

function BankAccount({ application, t }: { application?: TApplication; t: any }) {
	const ba = application?.content?.customer_particular?.bank_account || {}

	const data: BankAccountData = {
		bankName: ba.bank_branch_name,
		accountHolderName: ba.full_name,
		accountNumber: ba.account_number,
	}
	return (
		<div className="flex flex-col gap-6">
			<InfoSection title={t('sections.bank_account_info')}>
				<InfoGrid>
					<InfoItem label={t('fields.bank_name')} value={data?.bankName} />
					<InfoItem label={t('fields.account_holder')} value={data?.accountHolderName} />
					<InfoItem label={t('fields.account_number')} value={data?.accountNumber} />
				</InfoGrid>
			</InfoSection>
		</div>
	)
}

export default BankAccount
