'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminMt5Service } from '@/services/admin/mt5'
import { formatNumber } from '@/utils/money'
import { useTranslations } from 'next-intl'
import dayjs from '@/utils/dayjs'

interface SummaryTabProps {
  accountNo: string
}

const SummaryTab = ({ accountNo }: SummaryTabProps) => {
  const t = useTranslations('admin.customers.tabs.summary_content')
  const { data: mt5Data, isLoading } = useQuery({
    queryKey: adminMt5Service.getMT5UserById.key(accountNo),
    queryFn: () => adminMt5Service.getMT5UserById.get(accountNo),
    enabled: !!accountNo,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-x-16 gap-y-6">
        {[1, 2, 3].map((col) => (
          <div key={col} className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="h-4 w-full animate-pulse bg-mui-text-secondary rounded"
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  const answer = mt5Data?.data?.answer
  const tradeAccounts = answer?.TradeAccounts

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '_'
    return dayjs(+dateString * 1000).format('DD/MM/YYYY')
  }

  const parseAccountType = (group: string | undefined) => {
    if (!group) return '_'
    const parts = group.split('\\')
    return parts[1] || '_'
  }

  const renderRow = (
    label: string,
    value: string | number | undefined | null
  ) => (
    <div className="flex justify-between items-center text-sm py-1 gap-4">
      <span className="text-mui-text-secondary shrink-0">{label}</span>
      <span
        className="font-medium text-mui-text-primary truncate"
        title={value?.toString()}
      >
        {value === null || value === undefined || value === '' ? '--' : value}
      </span>
    </div>
  )

  const renderMoneyRow = (
    label: string,
    value: string | number | undefined | null
  ) => (
    <div className="flex justify-between items-center text-sm py-1 gap-4">
      <span className="text-mui-text-secondary shrink-0">{label}</span>
      <span
        className="font-medium text-mui-text-primary truncate"
        title={
          value !== null && value !== undefined && value !== ''
            ? formatNumber(value)
            : '--'
        }
      >
        {value !== null && value !== undefined && value !== ''
          ? formatNumber(value)
          : '--'}
      </span>
    </div>
  )

  return (
    <div className="grid grid-cols-1 gap-x-16 gap-y-2 mt-4 sm:grid-cols-3">
      {/* COLUMN 1 */}
      <div className="flex flex-col">
        {renderRow(t('account_name'), answer?.Name)}
        {renderRow(t('account_number'), answer?.Login)}
        {renderRow(t('account_type'), parseAccountType(answer?.Group))}
        <div className="mt-4 flex flex-col">
          {renderMoneyRow(t('equity'), tradeAccounts?.Equity)}
          {renderMoneyRow(t('balance'), answer?.Balance)}
          {renderRow(t('deposit'), '_')}
          {renderRow(t('withdrawal'), '_')}
          {renderMoneyRow(t('credit_facility'), answer?.Credit)}
          {renderRow(t('commission'), '_')}
          {renderMoneyRow(t('swaps'), tradeAccounts?.Storage)}
        </div>
      </div>
      {/* COLUMN 2 */}
      <div className="flex flex-col">
        {renderRow(t('account_status'), answer?.Status || t('active'))}
        {renderRow(
          t('leverage'),
          answer?.Leverage ? `1:${answer.Leverage}` : '_'
        )}
        {renderRow(t('platform'), 'MT5')}
        <div className="mt-4 flex flex-col">
          {renderMoneyRow(t('total_profit'), tradeAccounts?.Profit)}
          {renderMoneyRow(t('profit'), tradeAccounts?.Profit)}
          {renderRow(t('volume_lots'), '_')}
          {renderRow(t('trades'), '_')}
          {renderRow(t('profitability'), '_')}
          {renderRow(t('average_profit'), '_')}
          {renderRow(t('average_loss'), '_')}
        </div>
      </div>
      {/* COLUMN 3 */}
      <div className="flex flex-col">
        {renderRow(t('timezone'), '_')}
        {renderRow(t('created'), formatDate(answer?.Registration))}
        {renderRow(t('server_name'), '_')}
        <div className="mt-4 flex flex-col">
          {renderMoneyRow(t('floating_pl'), tradeAccounts?.Floating)}
          {renderRow(t('closed_pl'), '_')}
          {renderMoneyRow(
            t('margin_requirements'),
            tradeAccounts?.MarginInitial
          )}
          {renderMoneyRow(t('free_margin'), tradeAccounts?.MarginFree)}
          {renderMoneyRow(t('margin_level'), tradeAccounts?.MarginLevel)}
          {renderRow(t('last_trade'), '_')}
        </div>
      </div>
    </div>
  )
}

export default SummaryTab
