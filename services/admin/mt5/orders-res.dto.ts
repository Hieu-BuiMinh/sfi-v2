export interface TMT5Order {
  Symbol: string
  Order: string
  TimeSetup: number
  TimeDone: number
  Type: string
  VolumeInitial: number
  VolumeInitialExt: number
  PriceOrder: number
  PriceCurrent: number
  PriceSL: number
  PriceTP: number
  // Fields that might not be directly in payload but are in UI req
  Commission?: string
  Storage?: string
  CHG?: string
  Profit?: string
}

export interface TMT5OrdersResponse {
  total: number
  data: TMT5Order[]
}
