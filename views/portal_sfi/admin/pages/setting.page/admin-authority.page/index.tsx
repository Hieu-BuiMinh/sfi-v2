'use client'

import React from 'react'
import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { Button } from '@mui/material'
import { useQueryState } from 'nuqs'
import AdminStaffTab from './components/staff-tab'
import AdminRoleTab from './components/role-tab'
import AddIcon from '@mui/icons-material/Add'
import SfiTabButton, {
  SfiTabButtonItem,
} from '@/components/tab/sfi-tab-button'

import { useTranslations } from 'next-intl'

function AdminAuthorityPageView() {
  const t = useTranslations('admin.settings.authority')
  const [tab, setTab] = useQueryState('tab', { defaultValue: 'staff' })

  const TABS: SfiTabButtonItem[] = [
    {
      key: 'staff',
      label: t('tabs.staff'),
      content: <AdminStaffTab />,
    },
    {
      key: 'roles',
      label: t('tabs.roles'),
      content: <AdminRoleTab />,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <BreadcrumbSfi
        items={[
          { label: t('breadcrumb.admin'), href: '/dashboard' },
          { label: t('breadcrumb.authority'), href: '/settings/authority' },
          {
            label:
              tab === 'roles' ? t('breadcrumb.roles') : t('breadcrumb.staff'),
          },
        ]}
      />

      <div className="flex items-center justify-between">
        <SfiPageTitle title={t('title')} subtitle={t('subtitle')} />
      </div>

      <div className="flex flex-col gap-4">
        <SfiTabButton
          items={TABS}
          value={tab || 'staff'}
          onChange={(val) => setTab(val)}
          className="flex-1"
          buttonProps={{
            className: 'w-[200px]',
          }}
        />
      </div>
    </div>
  )
}

export default AdminAuthorityPageView
