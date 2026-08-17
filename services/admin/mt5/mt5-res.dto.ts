export interface TTradeAccounts {
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
}

export interface TApiData {
  AppID: string
  ID: string
  ValueInt: string
  ValueUInt: string
  ValueDouble: string
}

export interface TMT5UserAnswer {
  Login: string
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
  TradeAccounts: TTradeAccounts
  ApiData: TApiData[]
  LeadCampaign: string
  LeadSource: string
}

export interface TMT5UserRes {
  retcode: string
  answer: TMT5UserAnswer
}
