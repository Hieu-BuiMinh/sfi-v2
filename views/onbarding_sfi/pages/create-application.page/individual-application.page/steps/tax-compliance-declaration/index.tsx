'use client'

import RfhSfiRadioGroup from '@/components/rhf-inputs/rfh-sfi-radio-group'
import RfhSfiTextField from '@/components/rhf-inputs/rfh-sfi-textfield'
import { useCustomerApplication } from '@/views/onbarding_sfi/components/customer-application-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress, Typography } from '@mui/material'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { TaxComplianceFormData, TaxResidencyOption, taxComplianceSchema } from './form-validate/schema'

const jurisdictionRows = ['first', 'second', 'third'] as const

const getEmptyResidentDetail = () => ({
	first: { tax_resident: '', tin: '', type_of_tin: '', reason_description: '' },
	second: { tax_resident: '', tin: '', type_of_tin: '', reason_description: '' },
	third: { tax_resident: '', tin: '', type_of_tin: '', reason_description: '' },
})

const declarations = [
	'We are responsible for our own tax affairs and ensure that our account(s) maintained with SFI is in compliance with the tax laws of the relevant jurisdiction(s) which our permanent establishment is subject to, or we are tax resident of.',
	'To the best of our knowledge, the Information provided in this Form is true, correct and complete.',
	"Upon SFI's request, we agree to provide SFI with all required documentation or information that may be required to enable SFI to make inquiries on our tax status.",
	"We agree and consent that SFI may collect, process, use and store our Information for performing its obligations under FATCA or other applicable laws and for SFI's internal management purposes.",
	'We acknowledge that SFI may take whatever action SFI considers necessary to meet its FATCA or other applicable requirements.',
	'We will notify SFI immediately if there is any change to the circumstances declared above.',
	'We understand that SFI will rely on the information provided above when considering whether to accept our account application or continue a broker-customer relationship with us.',
	'We acknowledge and agree that SFI will not be liable to us for losses, costs, expenses, or other liabilities resulting from SFI taking any action set out above.',
]

function IndividualTaxComplianceStep() {
	const { currentIndiApp, updateApplicationMutation } = useCustomerApplication()
	const [, setStep] = useQueryState('step', parseAsInteger)
	const currentForm = currentIndiApp?.content?.tax_compliance_declaration
	const personalInformation = currentIndiApp?.content?.customer_particular?.personal_information

	const { control, handleSubmit, reset, setValue } = useForm<TaxComplianceFormData>({
		resolver: zodResolver(taxComplianceSchema),
		mode: 'onChange',
		defaultValues: {
			customer_name: currentForm?.customer_name || personalInformation?.full_name || '',
			register_address:
				currentForm?.register_address ||
				personalInformation?.id_address ||
				personalInformation?.home_address ||
				personalInformation?.current_address ||
				'',
			resident_contry: currentForm?.resident_contry || TaxResidencyOption.ID_ONLY,
			resident_detail: currentForm?.resident_detail || getEmptyResidentDetail(),
		},
	})

	useEffect(() => {
		if (!currentForm) return

		reset({
			customer_name: currentForm.customer_name || personalInformation?.full_name || '',
			register_address:
				currentForm.register_address ||
				personalInformation?.id_address ||
				personalInformation?.home_address ||
				personalInformation?.current_address ||
				'',
			resident_contry: currentForm.resident_contry || TaxResidencyOption.ID_ONLY,
			resident_detail: currentForm.resident_detail || getEmptyResidentDetail(),
		})
	}, [currentForm, personalInformation, reset])

	const residentCountry = useWatch({ control, name: 'resident_contry' })
	const residentDetail = useWatch({ control, name: 'resident_detail' })

	const handleResidentCountryChange = (value: string) => {
		setValue('resident_contry', value as TaxResidencyOption, { shouldValidate: true })
		if (value === TaxResidencyOption.ID_ONLY) {
			setValue('resident_detail', getEmptyResidentDetail(), { shouldValidate: true })
		}
	}

	const onSubmit = (data: TaxComplianceFormData) => {
		if (!currentIndiApp) return

		updateApplicationMutation.mutate(
			{
				data: {
					...currentIndiApp,
					content: {
						...currentIndiApp.content,
						tax_compliance_declaration: data,
					},
				},
			},
			{ onSuccess: () => setStep(2) }
		)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			<Typography variant="h5" className="font-bold">
				Tax Compliance Declaration
			</Typography>

			<p className="text-sm leading-relaxed">
				It is our policy to apply anti-money laundering and other integrity standards in our business. This
				includes compliance with the US Foreign Account Tax Compliance Act <strong>&apos;FATCA&apos;</strong>.
				In line with such requirement, we are required to obtain information concerning the tax residency of our
				customers.
			</p>

			<div className="flex flex-col gap-4">
				<RfhSfiTextField name="customer_name" control={control} label="We," placeholder="Full legal name" />
				<RfhSfiTextField
					name="register_address"
					control={control}
					label="At register address"
					placeholder="Complete address"
				/>
			</div>

			<p className="font-bold">Here by declare and confirm that:</p>

			<div>
				<p className="mb-2">1. We are a tax resident of (please select the country of tax residency):</p>
				<RfhSfiRadioGroup
					name="resident_contry"
					control={control}
					onValueChange={handleResidentCountryChange}
					options={[
						{ label: 'Indonesia only', value: TaxResidencyOption.ID_ONLY },
						{ label: 'US only', value: TaxResidencyOption.US_ONLY },
						{
							label: 'Neither Indonesia nor the US please complete the section below',
							value: TaxResidencyOption.NEITHER,
						},
					]}
				/>
			</div>

			<div>
				<p className="mb-4 text-sm">
					We are tax resident of the following countries (indicate the tax reference number type and number
					applicable in each country)
				</p>

				<div className="border-mui-divider overflow-auto rounded-lg border">
					<table className="w-full min-w-200 border-collapse text-sm">
						<thead className="bg-mui-skeleton-bg">
							<tr>
								<th className="border-mui-divider w-12 border-b p-3 text-center">#</th>
								<th className="border-mui-divider w-1/4 border-b p-3 text-left">
									Country/Jurisdiction of Tax Residence
								</th>
								<th className="border-mui-divider w-1/4 border-b p-3 text-left">
									Tax Identification Number (TIN) or equivalent
								</th>
								<th className="border-mui-divider w-64 border-b p-3 text-left">
									If TIN or equivalent is unavailable, please select reason A, B or C*
								</th>
							</tr>
						</thead>
						<tbody>
							{jurisdictionRows.map((row, index) => (
								<tr key={row} className="border-mui-divider border-b">
									<td className="p-3 text-center align-middle">{index + 1}</td>
									<td className="p-3 align-top">
										<RfhSfiTextField
											name={`resident_detail.${row}.tax_resident`}
											control={control}
											placeholder={index === 0 ? 'e.g. Singapore' : ''}
											disabled={residentCountry === TaxResidencyOption.ID_ONLY}
										/>
									</td>
									<td className="p-3 align-top">
										<RfhSfiTextField
											name={`resident_detail.${row}.tin`}
											control={control}
											placeholder={index === 0 ? 'e.g. 201120345M' : ''}
											disabled={residentCountry === TaxResidencyOption.ID_ONLY}
											onChange={(event) => {
												setValue(`resident_detail.${row}.tin`, event.target.value, {
													shouldValidate: true,
												})
												if (event.target.value.trim()) {
													setValue(`resident_detail.${row}.type_of_tin`, '')
													setValue(`resident_detail.${row}.reason_description`, '')
												}
											}}
										/>
									</td>
									<td className="p-3 align-top">
										<RfhSfiRadioGroup
											name={`resident_detail.${row}.type_of_tin`}
											control={control}
											row
											className="justify-center gap-4"
											disabled={residentCountry === TaxResidencyOption.ID_ONLY}
											onValueChange={(value) => {
												setValue(`resident_detail.${row}.type_of_tin`, value, {
													shouldValidate: true,
												})
												setValue(`resident_detail.${row}.tin`, '')
												if (value !== 'B') {
													setValue(`resident_detail.${row}.reason_description`, '')
												}
											}}
											options={[
												{ label: 'A', value: 'A' },
												{ label: 'B', value: 'B' },
												{ label: 'C', value: 'C' },
											]}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="text-mui-text-primary mt-4 flex flex-col gap-1 text-sm">
					<p>
						Reason A - The country/jurisdiction where Account Holder is liable to pay tax does not issue TIN
						to its residents
					</p>
					<p>Reason B - The Account Holder is otherwise unable to obtain a TIN or equivalent number</p>
					<p>Reason C - No TIN is required because the tax authorities do not require it to be disclosed</p>
				</div>

				{jurisdictionRows.map((row, index) =>
					residentDetail[row].type_of_tin === 'B' ? (
						<RfhSfiTextField
							key={row}
							name={`resident_detail.${row}.reason_description`}
							control={control}
							label={`Please provide explanation for Reason B (Jurisdiction ${index + 1})`}
							placeholder="Detailed explanation"
							containerClassName="mt-4"
						/>
					) : null
				)}
			</div>

			<div className="mt-4 flex flex-col gap-4 text-sm">
				{declarations.map((declaration, index) => (
					<div key={declaration} className="flex gap-3">
						<span className="min-w-5">{index + 2}.</span>
						<p>{declaration}</p>
					</div>
				))}
			</div>

			<div className="mt-8 flex justify-end">
				<Button variant="contained" type="submit" disabled={updateApplicationMutation.isPending}>
					{updateApplicationMutation.isPending ? (
						<CircularProgress size={24} color="inherit" />
					) : (
						'Confirm and Continue'
					)}
				</Button>
			</div>
		</form>
	)
}

export default IndividualTaxComplianceStep

/*
+ chọn Indonesia: clear hết bảng ở dưới và disable
+ chọn US hoặc neither Indo nor the US: lấy theo rule dưới:
1) Bắt buộc phải có ít nhất 1 record ở dòng đầu tiên
2) Nếu nhập country thì phải nhập TIN hoặc chọn reason
3) Nếu nhập TIN hoặc chọn reason thì bắt buộc phải nhập country
4) Nếu nhập TIN thì clear hết tick chọn của reason (không disable, khách vẫn có thể tick chọn reason như bước #5)
5) Nếu tick chọn reason thì clear TIN (không disable, khách vẫn có thể nhập TIN như bước #4)
6) Nếu chọn reason B thì phải nhập chi tiết nguyên nhân
7) Chỉ cho phép complete khi:
+ Có ít nhất 1 record ở dòng đầu tiên đối với US hoặc neither Indo nor the US
+ Ở dòng đầu tiên, nếu đã nhập Country thì phải nhập TIN hoặc chọn reason, nếu chọn reason B thì phải nhập chi tiết, không đc để trống country
+ Ở dòng thứ 2 trở đi, nếu nhập country thì phải nhập TIN hoặc reason, nếu xóa country thì không required nữa
*/
