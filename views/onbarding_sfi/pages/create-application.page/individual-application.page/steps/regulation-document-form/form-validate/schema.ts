import { z } from 'zod'

export const REGULATION_DOCUMENTS = [
	{
		name: 'commodity_broker_profile',
		label: 'Commodity Broker Profile',
		pdfType: 'commodity_broker_profile',
	},
	{
		name: 'trading_simulation_statement',
		label: 'Statement of Having Conducted Trading Simulation',
		pdfType: 'statement_of_having_conducted_trading_simulation',
	},
	{
		name: 'risk_disclosure_statement',
		label: 'Risk Disclosure Statement',
		pdfType: 'risk_disclosure_statement',
	},
	{
		name: 'account_opening_application',
		label: 'Electronic Online Transaction Account Opening Application',
		pdfType: 'electronic_online_transaction_account_opening_application',
	},
	{
		name: 'commodity_trading_agreement',
		label: 'Commodity Trading Agreement',
		pdfType: 'commodity_trading_agreement',
	},
	{
		name: 'nano_contract_trading_rules',
		label: 'Trading Rules of Nano Derivative Contracts',
		pdfType: 'trading_rules_of_nano_derivative_contracts',
	},
	{
		name: 'customer_fund_statement',
		label: 'Statement that the Funds Used as Margin are the Customer’s Own Funds, Statement of Responsibility for Customer’s Transaction Access Credential, Disclaimer of Responsibility for Electronic Instruction Acceptance',
		pdfType: 'statement_of_responsibility',
	},
	{
		name: 'trading_platform_terms',
		label: 'Terms and Conditions of Trading Platform Use',
		pdfType: 'terms_and_conditions_of_trading_platform_use',
	},
	{
		name: 'personal_data_consent',
		label: 'Personal Data Consent',
		pdfType: 'personal_data_consent',
	},
] as const

export const REGULATION_DECLARATIONS = [
	{
		name: 'employment_declaration',
		label: 'I warrant and represent that I am not, nor are any of my family members, currently employed by or affiliated with Bappebti, PT ACM Mercantile Exchange, or PT Asia Commodity Clearing House. I understand and agree that any misrepresentation regarding my employment status or affiliations may result in the immediate rejection or termination of my PNA account.',
	},
	{
		name: 'bankruptcy_declaration',
		label: 'I warrant and represent that I have never been declared bankrupt, am not currently subject to any bankruptcy proceedings or suspension of debt payment obligations (PKPU), and am not currently involved in any legal proceedings or other circumstances that may affect my ability to fulfill my legal and/or financial obligations.',
	},
	{
		name: 'information_accuracy_declaration',
		label: 'I confirm and declare that all data and information provided by me are true, accurate, complete, and correct to the best of my knowledge, and I acknowledge that I am fully responsible for their validity.',
	},
	{
		name: 'indemnity_declaration',
		label: 'I acknowledge that if any information provided by me in this document is found to be false, incomplete, or inaccurate, PT Pan Asia Niaga shall have the right to reject, suspend, restrict, freeze, or terminate my account and services without prior notice, and may report the matter to the relevant authorities where required. I agree to indemnify and hold harmless PT Pan Asia Niaga from and against any losses, liabilities, claims, or costs arising from any false or misleading statement made by me.',
	},
] as const

const requiredConfirmation = z.boolean().refine(Boolean, 'This field is required')

export const regulationDocumentSchema = z.object({
	confirm_understand: requiredConfirmation,
	commodity_broker_profile: requiredConfirmation,
	trading_simulation_statement: requiredConfirmation,
	risk_disclosure_statement: requiredConfirmation,
	account_opening_application: requiredConfirmation,
	commodity_trading_agreement: requiredConfirmation,
	nano_contract_trading_rules: requiredConfirmation,
	customer_fund_statement: requiredConfirmation,
	trading_platform_terms: requiredConfirmation,
	personal_data_consent: requiredConfirmation,
	employment_declaration: requiredConfirmation,
	bankruptcy_declaration: requiredConfirmation,
	information_accuracy_declaration: requiredConfirmation,
	indemnity_declaration: requiredConfirmation,
})

export type RegulationDocumentFormData = z.infer<typeof regulationDocumentSchema>

export const REGULATION_CONFIRMATION_FIELDS = [
	...REGULATION_DOCUMENTS.map((document) => document.name),
	...REGULATION_DECLARATIONS.map((declaration) => declaration.name),
] as const
