'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiTabs, {
  SfiTabItem,
} from '@/components/tab/sfi-tab-default'
import SfiPageTitle from '@/components/wording/page-title'
import { TRateType } from '@/services/admin/finance/rates/rates-req.dto'
import { TRateItem } from '@/services/admin/finance/rates/rates-res.dto'
import AdminRatesTab from '@/views/portal_sfi/admin/pages/rates.page/components/rates-tab'
import SetupRateModal from '@/views/portal_sfi/admin/pages/rates.page/components/setup-rate-modal'
import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

function AdminRatesPageView() {
  const t = useTranslations('admin.rates')
  const [tab, setTab] = useQueryState('tab', { defaultValue: 'deposit' })
  const [openSetup, setOpenSetup] = useState(false)
  const [selectedRate, setSelectedRate] = useState<TRateItem | undefined>()

  const handleEdit = (rate: TRateItem) => {
    setSelectedRate(rate)
    setOpenSetup(true)
  }

  const handleCloseModal = () => {
    setOpenSetup(false)
    setSelectedRate(undefined)
  }

  const TABS: SfiTabItem[] = [
    {
      key: 'deposit',
      label: t('tabs.deposit'),
      content: <AdminRatesTab type="deposit" onEdit={handleEdit} />,
    },
    {
      key: 'withdrawal',
      label: t('tabs.withdrawal'),
      content: <AdminRatesTab type="withdrawal" onEdit={handleEdit} />,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <BreadcrumbSfi
        items={[
          { label: t('breadcrumb.admin'), href: '/dashboard' },
          { label: t('breadcrumb.rates') },
        ]}
      />

      <div className="flex items-center justify-between">
        <SfiPageTitle title={t('title')} subtitle={t('subtitle')} />
        <Button
          variant="contained"
          className="rounded-lg h-10 px-5"
          onClick={() => setOpenSetup(true)}
        >
          {t('dialog.setup_rate.actions.create')}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SfiTabs
            items={TABS}
            value={tab || 'deposit'}
            onChange={(val) => setTab(val)}
            className="flex-1"
          />
        </div>
      </div>

      <SetupRateModal
        open={openSetup}
        onClose={handleCloseModal}
        type={(tab as TRateType) || 'deposit'}
        initialData={selectedRate}
      />
    </div>
  )
}

export default AdminRatesPageView
