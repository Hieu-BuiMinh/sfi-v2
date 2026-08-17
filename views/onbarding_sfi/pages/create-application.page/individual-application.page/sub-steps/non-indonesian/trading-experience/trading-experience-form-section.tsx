import RfhSfiCheckbox from '@/components/rhf-inputs/rfh-sfi-checkbox'
import RfhSfiSingleSelect from '@/components/rhf-inputs/rfh-sfi-single-select'
import { Typography } from '@mui/material'
import { useFormContext, useWatch } from 'react-hook-form'
import {
	INVESTMENT_OBJECTIVES_OPTIONS,
	TRADING_EXPERIENCE_OPTIONS,
	TradingExperienceFormData,
	YEARS_OF_TRADING_OPTIONS,
} from './form-validate/schema'

function TradingExperienceFormSection() {
	const { control } = useFormContext<TradingExperienceFormData>()
	const experienceInTrading = useWatch({ control, name: 'experience_in_trading' })

	return (
		<div className="flex flex-col gap-6">
			<Typography variant="h6" className="text-primary font-bold">
				Trading Experience
			</Typography>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<RfhSfiSingleSelect
					name="investment_objectives"
					control={control}
					label="Investment Objectives"
					options={INVESTMENT_OBJECTIVES_OPTIONS}
				/>
				<RfhSfiSingleSelect
					name="experience_in_trading"
					control={control}
					label="Trading Experience"
					options={TRADING_EXPERIENCE_OPTIONS}
				/>

				{experienceInTrading === 'yes' && (
					<RfhSfiSingleSelect
						name="year_of_tradding"
						control={control}
						label="Years of Trading Experience"
						options={YEARS_OF_TRADING_OPTIONS}
					/>
				)}

				{experienceInTrading === 'no' && (
					<div className="lg:col-span-2">
						<RfhSfiCheckbox
							name="trading_acknowledgement"
							control={control}
							label="Trading involves significant risk of loss and is not suitable for everyone. If you have no prior trading experience, you should understand that you may lose some or all of your invested capital. Past performance does not guarantee future results. Please ensure you fully understand the risks involved and seek independent advice if necessary before trading."
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default TradingExperienceFormSection
