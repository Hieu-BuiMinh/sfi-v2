import { IPermissionGroup } from './permission.types'

export const getPermissionConfig = (t: any): IPermissionGroup[] => [
  {
    key: 'application',
    label: t('permissions.groups.application'),
    permissions: [
      {
        key: 'view_application',
        label: t('permissions.labels.view_application'),
      },
      {
        key: 'add_application',
        label: t('permissions.labels.add_application'),
      },
      {
        key: 'edit_application',
        label: t('permissions.labels.edit_application'),
      },
      {
        key: 'approve_application',
        label: t('permissions.labels.approve_application'),
      },
      {
        key: 'reject_application',
        label: t('permissions.labels.reject_application'),
      },
      {
        key: 'request_application',
        label: t('permissions.labels.request_application'),
      },
    ],
  },
  {
    key: 'worksheet',
    label: t('permissions.groups.worksheet'),
    permissions: [
      {
        key: 'view_sales',
        label: t('permissions.labels.view_sales'),
      },
      {
        key: 'edit_sales',
        label: t('permissions.labels.edit_sales'),
      },
      {
        key: 'approve_sales',
        label: t('permissions.labels.approve_sales'),
      },
      {
        key: 'view_risk',
        label: t('permissions.labels.view_risk'),
      },
      {
        key: 'edit_risk',
        label: t('permissions.labels.edit_risk'),
      },
      {
        key: 'approve_risk',
        label: t('permissions.labels.approve_risk'),
      },
      {
        key: 'view_onboarding',
        label: t('permissions.labels.view_onboarding'),
      },
      {
        key: 'edit_onboarding',
        label: t('permissions.labels.edit_onboarding'),
      },
      {
        key: 'approve_onboarding',
        label: t('permissions.labels.approve_onboarding'),
      },
      {
        key: 'view_compliance',
        label: t('permissions.labels.view_compliance'),
      },
      {
        key: 'edit_compliance',
        label: t('permissions.labels.edit_compliance'),
      },
      {
        key: 'approve_compliance',
        label: t('permissions.labels.approve_compliance'),
      },
    ],
  },
  {
    key: 'customer',
    label: t('permissions.groups.customer'),
    permissions: [
      {
        key: 'view_customer',
        label: t('permissions.labels.view_customer'),
      },
      {
        key: 'add_customer',
        label: t('permissions.labels.add_customer'),
      },
    ],
  },
  {
    key: 'trading_account',
    label: t('permissions.groups.trading_account'),
    permissions: [
      {
        key: 'view_trading_account',
        label: t('permissions.labels.view_trading_account'),
      },
      {
        key: 'edit_account',
        label: t('permissions.labels.edit_account'),
      },
    ],
  },
  {
    key: 'staff',
    label: t('permissions.groups.staff'),
    permissions: [
      {
        key: 'view_staff',
        label: t('permissions.labels.view_staff'),
      },
      {
        key: 'add_staff',
        label: t('permissions.labels.add_staff'),
      },
      {
        key: 'edit_staff',
        label: t('permissions.labels.edit_staff'),
      },
    ],
  },
  {
    key: 'payment',
    label: t('permissions.groups.payment'),
    permissions: [
      {
        key: 'view_payment',
        label: t('permissions.labels.view_payment'),
      },
      {
        key: 'add_payment',
        label: t('permissions.labels.add_payment'),
      },
      {
        key: 'edit_payment',
        label: t('permissions.labels.edit_payment'),
      },
    ],
  },
]
