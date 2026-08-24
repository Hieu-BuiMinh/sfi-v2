import { z } from 'zod'

export const permissionTabSchema = z.object({
  roles: z.record(z.string(), z.boolean()),
  managers: z.record(z.string(), z.string().optional()),
})

export type IPermissionTabValues = z.infer<typeof permissionTabSchema>
