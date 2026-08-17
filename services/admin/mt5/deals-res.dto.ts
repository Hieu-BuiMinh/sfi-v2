export interface TMT5Deal {
  Symbol: string
  Deal: string
  Time: number
  Order: string
  Action: string
  Entry: string
  Volume: number
  VolumeExt: number
  Price: number
  PriceSL: number
  PriceTP: number
  Commission: number
  Storage: number
  Profit: number
}

export interface TMT5DealsResponse {
  total: number
  data: TMT5Deal[]
}
