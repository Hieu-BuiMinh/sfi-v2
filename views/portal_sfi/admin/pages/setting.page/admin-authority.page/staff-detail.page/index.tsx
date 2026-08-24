'use client'

import BreadcrumbSfi from '@/components/navigations/breadcrumb'
import SfiPageTitle from '@/components/wording/page-title'
import { adminStaffsService } from '@/services/admin/staffs'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import SfiStaffStatusChip from '@/components/chips/staff-status-chip'
import { cn } from '@/utils/cn'
import { useTranslations } from 'next-intl'

interface AdminStaffDetailPageViewProps {
  id: string
}

function AdminStaffDetailPageView({ id }: AdminStaffDetailPageViewProps) {
  const t = useTranslations('admin.settings.authority')
  const { data: staffData, isLoading } = useQuery({
    queryKey: adminStaffsService.getStaffById.key({ id }),
    queryFn: () => adminStaffsService.getStaffById.get({ id }),
  })

  const staff = staffData?.data

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="h-12 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 gap-6 mt-4">
          <div className="h-96 bg-gray-100 rounded-xl" />
          <div className="h-48 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="flex flex-col gap-5">
        <BreadcrumbSfi
          items={[
            { label: t('breadcrumb.admin'), href: '/dashboard' },
            { label: t('breadcrumb.authority'), href: '/settings/authority' },
            { label: t('breadcrumb.staff_detail') },
          ]}
        />
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          {t('detail.staff.not_found')}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbSfi
        items={[
          { label: t('breadcrumb.admin'), href: '/dashboard' },
          { label: t('breadcrumb.authority'), href: '/settings/authority' },
          { label: t('breadcrumb.staff'), href: '/settings/authority' },
          { label: t('breadcrumb.staff_detail') },
        ]}
      />

      <SfiPageTitle
        title={t('detail.staff.title')}
        subtitle={`${t('table.columns.object_id')}: ${id}`}
      />

      <div className="flex flex-col gap-8 mt-2">
        {/* Section 1: User Information */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl md:border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">
            {t('detail.staff.user_info')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <FieldItem label={t('table.columns.object_id')} value={staff.id} />
            <FieldItem
              label={t('table.columns.status')}
              value={<SfiStaffStatusChip status={staff.status} />}
            />
            <FieldItem label={t('table.columns.email')} value={staff.email} />
            <FieldItem
              label={t('table.columns.full_name')}
              value={`${staff.first_name || ''} ${staff.last_name || ''}`}
            />
            <FieldItem
              label={t('form.add_staff.fields.gender.label')}
              value={staff.employee_profile?.gender}
            />
            <FieldItem
              label={t('form.add_staff.fields.date_of_birth.label')}
              value={
                staff.employee_profile?.dob
                  ? dayjs(staff.employee_profile.dob * 1000).format(
                      'YYYY-MM-DD'
                    )
                  : '-'
              }
            />
            <FieldItem
              label={t('form.add_staff.fields.nationality.label')}
              value={staff.employee_profile?.nationality}
            />
            <FieldItem
              label={t('form.add_staff.fields.phone_number.label')}
              value={staff.phone_number}
            />
            <FieldItem
              label={t('table.columns.position')}
              value={staff.positions?.map((p) => p.name).join(' + ')}
            />
            <FieldItem
              label={t('table.columns.department')}
              value={staff.departments?.map((d) => d.name).join(' + ')}
            />
            <FieldItem
              label={t('table.columns.sales_code')}
              value={staff.sale_codes?.map((s) => s.code).join(' + ')}
            />
            <FieldItem
              label={t('table.columns.created_time')}
              value={dayjs(staff.created_at * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )}
            />
          </div>
        </div>

        {/* Section 2: Management Information */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl md:border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">
            {t('detail.staff.management_info')}
          </h3>

          <div className="flex flex-col gap-8">
            {staff.managers && staff.managers.length > 0 ? (
              staff.managers.map((manager, index) => (
                <div
                  key={manager.id || index}
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12',
                    index !== 0 &&
                      'pt-8 border-t border-gray-100 dark:border-gray-800'
                  )}
                >
                  <FieldItem
                    label={t('form.add_staff.fields.manager_id.label')}
                    value={manager.id}
                  />
                  <FieldItem
                    label={t('detail.staff.management_info')}
                    value={manager.name}
                  />
                  <FieldItem
                    label={t('form.add_staff.fields.manager_email.label')}
                    value={manager.email}
                  />
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">
                {t('detail.staff.no_managers')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode | string | number | undefined | null
}) {
  return (
    <div className="flex flex-col gap-1.5 min-h-[48px]">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize tracking-wider">
        {label}
      </span>
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 break-words">
        {value || '-'}
      </div>
    </div>
  )
}

export default AdminStaffDetailPageView
