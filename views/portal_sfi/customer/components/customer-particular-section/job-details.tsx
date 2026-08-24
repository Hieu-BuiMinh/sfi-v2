/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { Divider } from '@mui/material'
import { TApplication } from '@/services/customer/applications/applications-res.dto'
import { InfoGrid, InfoItem, InfoSection } from '@/views/portal_sfi/customer/components/info-display'

export type JobDetailsData = {
	employment: {
		jobType?: string
		companyLineOfBusiness?: string
		companyName?: string
		jobTitle?: string
		companyAddress?: string
	}
	financial: {
		annualIncome?: string
		sourceOfFunds?: string
		tradingExperience?: string
		tradingExperienceYears?: string
	}
}

function JobDetails({ application, t }: { application?: TApplication; t: any }) {
	const jd = application?.content?.customer_particular?.job_details || {}

	const data: JobDetailsData = {
		employment: {
			jobType: jd.type_job,
			companyLineOfBusiness: jd.company_line_of_business,
			companyName: jd.company_name,
			jobTitle: jd.company_job_title,
			companyAddress: jd.company_address,
		},
		financial: {
			annualIncome: jd.annual_income,
			sourceOfFunds: jd.source_of_fund,
			tradingExperience: jd.experience_in_trading,
			tradingExperienceYears: jd.year_of_tradding,
		},
	}
	return (
		<div className="flex flex-col gap-6">
			<InfoSection title={t('sections.employment_info')}>
				<InfoGrid>
					<InfoItem label={t('fields.job_type')} value={data?.employment.jobType} />
					<InfoItem label={t('fields.company_business')} value={data?.employment.companyLineOfBusiness} />
					<InfoItem label={t('fields.company_name')} value={data?.employment.companyName} />
					<InfoItem label={t('fields.job_title')} value={data?.employment.jobTitle} />
					<InfoItem label={t('fields.company_address')} value={data?.employment.companyAddress} colSpan />
				</InfoGrid>
			</InfoSection>

			<Divider />

			<InfoSection title={t('sections.financial_info')}>
				<InfoGrid>
					<InfoItem label={t('fields.annual_income')} value={data?.financial.annualIncome} />
					<InfoItem label={t('fields.source_of_funds')} value={data?.financial.sourceOfFunds} />
					<InfoItem label={t('fields.trading_experience')} value={data?.financial.tradingExperience} />
					<InfoItem
						label={t('fields.trading_experience_years')}
						value={data?.financial.tradingExperienceYears}
					/>
				</InfoGrid>
			</InfoSection>
		</div>
	)
}

export default JobDetails
