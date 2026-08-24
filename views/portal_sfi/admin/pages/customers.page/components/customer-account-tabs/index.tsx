import SfiTabs, {
  SfiTabItem,
} from '@/components/tab/sfi-tab-default'
import React from 'react'
import SummaryTab from './summary-tab'
import FundTab from './fund-tab'
import HistoryTab from './history-tab'

function CustomerAccountTab({
  accountNo = '',
  type = 'DEMO',
}: {
  type?: 'DEMO' | 'LIVE'
  accountNo?: string
}) {
  const tabs: SfiTabItem[] = [
    {
      key: 'summary',
      label: 'Summary',
      content: <SummaryTab accountNo={accountNo} />,
    },
    {
      key: 'funds',
      label: 'Funds',
      content: <FundTab accountNo={accountNo} />,
    },
    {
      key: 'history',
      label: 'History',
      content: <HistoryTab accountNo={accountNo} />,
    },
  ]

  return <SfiTabs items={tabs} />
}

export default CustomerAccountTab
