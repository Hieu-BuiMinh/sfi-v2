/**
 * SYNCHRONIZATION RULE:
 * This utility (`utils/toast.ts`) handles toast notifications for non-React contexts (API services, Axios interceptors, etc.).
 * Any additions, modifications, or method signature updates here MUST be synchronized with `@/hooks/use-toast.ts`.
 */

import { toast, ExternalToast } from 'sonner'

export type ToastOptions = ExternalToast

export const toastUtil = {
	success: (message: string | React.ReactNode, options?: ToastOptions) => {
		return toast.success(message, options)
	},
	error: (message: string | React.ReactNode, options?: ToastOptions) => {
		return toast.error(message, options)
	},
	info: (message: string | React.ReactNode, options?: ToastOptions) => {
		return toast.info(message, options)
	},
	warning: (message: string | React.ReactNode, options?: ToastOptions) => {
		return toast.warning(message, options)
	},
	loading: (message: string | React.ReactNode, options?: ToastOptions) => {
		return toast.loading(message, options)
	},
	dismiss: (toastId?: string | number) => {
		return toast.dismiss(toastId)
	},
	promise: <T>(
		promise: Promise<T> | (() => Promise<T>),
		data?: {
			loading?: string | React.ReactNode
			success?: string | React.ReactNode | ((data: T) => string | React.ReactNode)
			error?: string | React.ReactNode | ((error: unknown) => string | React.ReactNode)
			finally?: () => void
		} & ToastOptions
	) => {
		return toast.promise(promise, data)
	},
}

export default toastUtil

/**
 * Usage Examples:
 *
 * 1. In API Services / Non-React Contexts (using Utility):
 *    import { toastUtil } from '@/utils/toast'
 *
 *    toastUtil.success('Operation completed successfully!')
 *    toastUtil.error('Network Error')
 *    toastUtil.warning('Please check parameters')
 *    toastUtil.info('Session expiring soon')
 *
 * 2. Inside React Components (using Hook wrapper):
 *    import { useToast } from '@/hooks/use-toast'
 *
 *    const { showSuccess, showError } = useToast()
 *    showSuccess('Saved successfully!')
 *
 * 3. Handling Promises (Auto Loading -> Success/Error state):
 *    toastUtil.promise(saveData(), {
 *        loading: 'Saving data...',
 *        success: 'Data saved successfully!',
 *        error: 'Failed to save data',
 *    })
 */
