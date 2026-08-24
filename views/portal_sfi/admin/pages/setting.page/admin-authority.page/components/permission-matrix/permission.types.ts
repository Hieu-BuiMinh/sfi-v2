export interface IPermissionItem {
  key: string
  label: string
}

export interface IPermissionGroup {
  key: string
  label: string
  permissions: IPermissionItem[]
}

export type TPermissionFormValues = {
  permissions: Record<string, boolean>
}
