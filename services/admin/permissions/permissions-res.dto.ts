export interface TPermissionsResponse {
  Application: TApplicationPermissions
  Worksheet: TWorksheetPermissions
  Customer: TCustomerPermissions
  'Trading Account': TTradingAccountPermissions
  Staff: TStaffPermissions
  Payment: TPaymentPermissions
}

export interface TApplicationPermissions {
  view_application: number
  add_application: number
  edit_application: number
  approve_application: number
  reject_application: number
  request_application: number
}

export interface TWorksheetPermissions {
  view_sales: number
  edit_sales: number
  approve_sales: number
  view_risk: number
  edit_risk: number
  approve_risk: number
  view_onboarding: number
  edit_onboarding: number
  approve_onboarding: number
  view_compliance: number
  edit_compliance: number
  approve_compliance: number
}

export interface TCustomerPermissions {
  view_customer: number
  add_customer: number
  edit_customer: number
}

export interface TTradingAccountPermissions {
  view_trading_account: number
  edit_account: number
}

export interface TStaffPermissions {
  view_staff: number
  add_staff: number
  edit_staff: number
}

export interface TPaymentPermissions {
  view_payment: number
  add_payment: number
  edit_payment: number
}
