import * as z from 'zod'
import dayjs from 'dayjs'

export const getStaffFormSchema = (t: any) =>
  z.object({
    email_address: z
      .string()
      .email(t('form.add_staff.validation.invalid_email')),
    first_name: z
      .string()
      .min(1, t('form.add_staff.validation.first_name_required')),
    last_name: z
      .string()
      .min(1, t('form.add_staff.validation.last_name_required')),
    gender: z
      .string()
      .refine((val) => !!val, t('form.add_staff.validation.gender_required')),
    date_of_birth: z
      .string()
      .refine((val) => !!val, t('form.add_staff.validation.dob_required'))
      .refine((val) => {
        if (!val) return false
        return dayjs().diff(dayjs(val), 'year') >= 18
      }, t('form.add_staff.validation.staff_min_age')),
    nationality: z
      .string()
      .refine(
        (val) => !!val,
        t('form.add_staff.validation.nationality_required')
      ),
    phone_number: z
      .string()
      .min(1, t('form.add_staff.validation.phone_required')),
    position: z
      .string()
      .refine((val) => !!val, t('form.add_staff.validation.position_required')),
    location: z
      .string()
      .refine((val) => !!val, t('form.add_staff.validation.location_required')),
    department: z
      .string()
      .refine(
        (val) => !!val,
        t('form.add_staff.validation.department_required')
      ),
    manager: z.string().optional(),
    manager_id: z.string().optional(),
    manager_email: z.string().optional(),
  })

export type IStaffFormValues = z.infer<ReturnType<typeof getStaffFormSchema>>

export interface StaffFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}
