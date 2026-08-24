/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { TApplication } from '@/services/customer/applications/applications-res.dto'
import { TaxResidencyOption } from '@/views/onbarding_sfi/pages/create-application.page/individual-application.page/steps/tax-compliance-declaration/form-validate/schema'

import { FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'

interface Props {
	data: TApplication['content']
	t: any
}

export default function TaxComplianceDeclarationView({ data, t }: Props) {
	const currentForm = data?.tax_compliance_declaration
	const residentCountry = currentForm?.resident_contry
	const residentDetail = currentForm?.resident_detail

	return (
		<div className="border-mui-divider flex flex-col gap-6 rounded-lg border p-6">
			<div className="text-mui-text-secondary text-sm leading-relaxed">{t('intro')}</div>

			<Grid container spacing={3}>
				<Grid size={12}>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium">{t('we')}</span>
						<div className="bg-mui-background-default border-mui-divider flex min-h-10 items-center rounded-md border p-2">
							{currentForm?.customer_name || '_'}
						</div>
					</div>
				</Grid>
				<Grid size={12}>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium">{t('address')}</span>
						<div className="bg-mui-background-default border-mui-divider flex min-h-10 items-center rounded-md border p-2">
							{currentForm?.register_address || '_'}
						</div>
					</div>
				</Grid>
			</Grid>

			<div className="mt-2 font-bold">{t('declare_confirm')}</div>

			<div>
				<div className="mb-2 text-sm">{t('residency_select')}</div>
				<RadioGroup value={residentCountry || ''}>
					<FormControlLabel
						value={TaxResidencyOption.ID_ONLY}
						control={<Radio disabled />}
						label={<span className="text-sm">{t('options.indonesia_only')}</span>}
					/>
					<FormControlLabel
						value={TaxResidencyOption.US_ONLY}
						control={<Radio disabled />}
						label={<span className="text-sm">{t('options.us_only')}</span>}
					/>
					<FormControlLabel
						value={TaxResidencyOption.NEITHER}
						control={<Radio disabled />}
						label={<span className="text-sm">{t('options.neither')}</span>}
					/>
				</RadioGroup>
			</div>

			<div className="mt-2">
				<Typography className="text-mui-text-secondary mb-4 text-sm">{t('countries_indication')}</Typography>

				<div className="border-mui-divider w-full overflow-auto rounded-lg border">
					<table className="w-full min-w-200 border-collapse text-sm">
						<thead className="bg-mui-skeleton-bg">
							<tr>
								<th className="border-mui-divider w-12 border-b p-3 text-center">#</th>
								<th className="border-mui-divider w-1/4 border-b p-3 text-left">
									{t('table.columns.country')}
								</th>
								<th className="border-mui-divider w-1/4 border-b p-3 text-left">
									{t('table.columns.tin')}
								</th>
								<th className="border-mui-divider w-48 border-b p-3 text-left">
									{t('table.columns.reason')}
								</th>
							</tr>
						</thead>
						<tbody>
							{(['first', 'second', 'third'] as const).map((order, index) => (
								<tr key={order} className="border-mui-divider border-b">
									<td className="align-center p-3 text-center">{index + 1}</td>
									<td className="p-3 align-top">
										<div className="bg-mui-background-default border-mui-divider flex min-h-10 items-center rounded-md border p-2">
											{residentDetail?.[order]?.tax_resident || '_'}
										</div>
									</td>
									<td className="p-3 align-top">
										<div className="bg-mui-background-default border-mui-divider flex min-h-10 items-center rounded-md border p-2">
											{residentDetail?.[order]?.tin || '_'}
										</div>
									</td>
									<td className="p-3 align-top">
										<RadioGroup
											value={residentDetail?.[order]?.type_of_tin || ''}
											row
											className="justify-center gap-4"
										>
											<FormControlLabel
												value="A"
												control={<Radio disabled size="small" />}
												label={<span className="text-xs">A</span>}
											/>
											<FormControlLabel
												value="B"
												control={<Radio disabled size="small" />}
												label={<span className="text-xs">B</span>}
											/>
											<FormControlLabel
												value="C"
												control={<Radio disabled size="small" />}
												label={<span className="text-xs">C</span>}
											/>
										</RadioGroup>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="text-mui-text-secondary mt-4 flex flex-col gap-1 text-xs">
					<div>{t('reasons.a')}</div>
					<div>{t('reasons.b')}</div>
					<div>{t('reasons.c')}</div>
				</div>

				{(['first', 'second', 'third'] as const).map((order, index) => {
					const typeOfTin = residentDetail?.[order]?.type_of_tin
					if (typeOfTin !== 'B') return null

					return (
						<div key={`reason-${order}`} className="mt-4">
							<div className="flex flex-col gap-1">
								<span className="text-sm font-medium">
									{t('reasons.explanation_b', { index: index + 1 })}
								</span>
								<div className="bg-mui-background-default border-mui-divider flex min-h-10 items-center rounded-md border p-2">
									{residentDetail?.[order]?.reason_description || '_'}
								</div>
							</div>
						</div>
					)
				})}
			</div>

			<div className="text-mui-text-primary mt-4 flex flex-col gap-4 text-sm">
				<div className="flex gap-3">
					<div className="min-w-5">2.</div>
					<div>{t('declarations.2')}</div>
				</div>
				<div className="flex gap-3">
					<div className="min-w-5">3.</div>
					<div>{t('declarations.3')}</div>
				</div>
				<div className="flex gap-3">
					<div className="min-w-5">4.</div>
					<div>{t('declarations.4')}</div>
				</div>
				<div className="flex gap-3">
					<div className="min-w-5">5.</div>
					<div>{t('declarations.5')}</div>
				</div>
				<div className="flex gap-3">
					<div className="min-w-5">6.</div>
					<div>{t('declarations.6')}</div>
				</div>
				<div className="flex gap-3">
					<div className="min-w-5">7.</div>
					<div>{t('declarations.7')}</div>
				</div>
				<div className="flex gap-3">
					<div className="min-w-5">8.</div>
					<div>{t('declarations.8')}</div>
				</div>
				<div className="flex gap-3">
					<div className="min-w-5">9.</div>
					<div>{t('declarations.9')}</div>
				</div>
			</div>
		</div>
	)
}
