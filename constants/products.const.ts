export type IAssets = {
  accountType: 'individual' | 'corporate' | ''
  Other_Investment_Products: boolean
  // FnO
  Future_And_Options: boolean
  // FX - CFD
  FX_And_CFDs: boolean
  Deliverable_FX: boolean
  Forex: boolean
  // OTC
  OTC_Trading: boolean | null
  OTC_Digital_Token_Derivatives: boolean
  OTC_Digital_Asset_Futures: boolean
  OTC_Digital_Asset_Structured_Products: boolean
  OTC_Derivatives: boolean
  //SFI
  nano_contracts_sfi?: boolean
  nano_contracts_sfid?: boolean
  // MAPS
  commodities_maps?: boolean
  nano_contracts_maps?: boolean
  // SFVN
  commodities_sfvn?: boolean
  nano_contracts_sfvn?: boolean
  //SMPL
  other_investment_products_smpl?: boolean
  otc_digital_asset_structured_products_smpl?: boolean
  otc_digital_asset_futures_smpl?: boolean
  otc_digital_token_derivaties_smpl?: boolean
  //SFLLC
  commodities_sfllc?: boolean
  // DCFX
  commodities_dcfx?: boolean
  nano_contracts_dcfx?: boolean
  // kayya
  nano_contracts_kayya?: boolean
}

export const products: {
  label: string
  value: keyof IAssets
  slug: string
  entity_id: string
  id: string
}[] = [
  {
    label: 'OTC Digital Token Derivatives',
    value: 'OTC_Digital_Token_Derivatives',
    slug: 'sdapl',
    entity_id: '1',
    id: '1',
  },
  {
    label: 'Over-The-Counter ("OTC") Digital Asset Futures',
    value: 'OTC_Digital_Asset_Futures',
    slug: 'sdapl',
    entity_id: '1',
    id: '2',
  },
  {
    label: 'Over-The-Counter ("OTC") Digital Asset Structured Products',
    value: 'OTC_Digital_Asset_Structured_Products',
    slug: 'sdapl',
    entity_id: '1',
    id: '3',
  },
  {
    label: 'Other Investment Products',
    value: 'Other_Investment_Products',
    slug: 'sdapl',
    entity_id: '1',
    id: '4',
  },
  {
    label: 'Future and Options',
    value: 'Future_And_Options',
    slug: 'sfspl',
    entity_id: '2',
    id: '5',
  },
  {
    label: 'Leveraged Forex including precious metals and CFDs',
    value: 'Forex',
    slug: 'sfspl',
    entity_id: '2',
    id: '6',
  },
  {
    label: 'Deliverable FX',
    value: 'Deliverable_FX',
    slug: 'sfspl',
    entity_id: '2',
    id: '7',
  },
  {
    label: 'Over-The-Counter (OTC) Derivatives (except FX and CFDs)',
    value: 'OTC_Derivatives',
    slug: 'sfspl',
    entity_id: '2',
    id: '8',
  },
  {
    label: 'Commodities',
    value: 'commodities_sfvn',
    slug: 'sfvn',
    entity_id: '3',
    id: '9',
  },
  {
    label: 'Nano Contracts',
    value: 'nano_contracts_sfvn',
    slug: 'sfvn',
    entity_id: '3',
    id: '10',
  },
  {
    label: 'Nano Contracts',
    value: 'nano_contracts_sfid',
    slug: 'sfid',
    entity_id: '5',
    id: '12',
  },
  {
    label: 'Commodities',
    value: 'commodities_maps',
    entity_id: '6',
    slug: 'maps',
    id: '13',
  },
  {
    label: 'Nano Contracts',
    value: 'nano_contracts_maps',
    entity_id: '6',
    slug: 'maps',
    id: '14',
  },
  //SMPL
  {
    label: 'OTC Digital Token Derivatives',
    value: 'otc_digital_token_derivaties_smpl',
    slug: 'smpl',
    entity_id: '7',
    id: '15',
  },
  {
    label: 'Over-The-Counter ("OTC") Digital Asset Futures',
    value: 'otc_digital_asset_futures_smpl',
    slug: 'smpl',
    entity_id: '7',
    id: '16',
  },
  {
    label: 'Over-The-Counter ("OTC") Digital Asset Structured Product',
    value: 'otc_digital_asset_structured_products_smpl',
    slug: 'smpl',
    entity_id: '7',
    id: '17',
  },
  {
    label: 'Other Investment Products',
    value: 'other_investment_products_smpl',
    slug: 'smpl',
    entity_id: '7',
    id: '18',
  },
  // SFLLC
  {
    label: 'Other Investment Products',
    value: 'commodities_sfllc',
    slug: 'sfllc',
    entity_id: '8',
    id: '19',
  },
  // DCFX
  {
    label: 'Commodities',
    value: 'commodities_dcfx',
    entity_id: '9',
    slug: 'maps',
    id: '13',
  },
  {
    label: 'Nano Contracts',
    value: 'nano_contracts_dcfx',
    entity_id: '9',
    slug: 'maps',
    id: '14',
  },
  {
    label: 'Nano Contracts',
    value: 'nano_contracts_kayya',
    slug: 'kayya',
    entity_id: '12',
    id: '10',
  },
  {
    label: 'Nano Contracts',
    value: 'nano_contracts_sfi',
    entity_id: '13',
    slug: 'sfi',
    id: '19',
  },
]
