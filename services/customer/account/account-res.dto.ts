/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCurrency } from '@/utils/number-format'

export interface CustomerAccount {
	id: string
	platform: string
	type: string
	account_id: string
	email: string
	group: string
	status: boolean
	created_at: string
	updated_at: string
	balance: string
	currency: TCurrency
	entity: string
	binding_account: string
	display_name: any
	smpl_talos_customer_type: any
}

export interface CustomerMT5Accountdetail {
	Login: string
	CurrencyDigits: string
	Balance: string
	Credit: string
	Margin: string
	MarginFree: string
	MarginLevel: string
	MarginLeverage: string
	Profit: string
	Storage: string
	Floating: string
	Equity: string
	SOActivation: string
	SOTime: string
	SOLevel: string
	SOEquity: string
	SOMargin: string
	Assets: string
	Liabilities: string
	BlockedCommission: string
	BlockedProfit: string
	MarginInitial: string
	MarginMaintenance: string
	TotalPositions: number
	TotalDeals: number
}

export type CustomerAccountDailyEquity = Record<string, number>

export interface AccountAssetsDistributions {
	name: string
	equityPercentage: number
}

export interface AccountItemByType {
	Login: number
	Group: string
	CertSerialNumber: string
	Rights: string
	MQID: string
	Registration: string
	LastAccess: string
	LastPassChange: string
	LastIP: string
	Name: string
	FirstName: string
	LastName: string
	MiddleName: string
	Company: string
	Account: string
	Country: string
	Language: string
	ClientID: string
	City: string
	State: string
	ZipCode: string
	Address: string
	Phone: string
	Email: string
	ID: string
	Status: string
	Comment: string
	Color: string
	PhonePassword: string
	Leverage: string
	Agent: string
	LimitPositions: string
	LimitOrders: string
	CurrencyDigits: string
	Balance: string
	Credit: string
	InterestRate: string
	CommissionDaily: string
	CommissionMonthly: string
	CommissionAgentDaily: string
	CommissionAgentMonthly: string
	BalancePrevDay: string
	BalancePrevMonth: string
	EquityPrevDay: string
	EquityPrevMonth: string
	LeadCampaign: string
	LeadSource: string
	mt5_account: CustomerMT5Accountdetail
	BindingAccount: string
	active: boolean
	created_at: number
	updated_at: number
}
