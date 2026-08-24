import { z } from 'zod'

export const permissionSchema = z
  .object({
    permissions: z.record(z.boolean()),
  })
  .refine((data) => Object.values(data.permissions).some(Boolean), {
    message: 'At least one permission must be selected',
    path: ['permissions'],
  })

export type TPermissionSchema = z.infer<typeof permissionSchema>
