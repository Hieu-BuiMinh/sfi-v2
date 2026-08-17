/* eslint-disable @next/next/no-location-assign-relative-destination */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import toastUtil from '@/utils/toast'
import { authService } from '@/services/common/auth'
import { adminAuth0Service } from '@/services/admin/auth0'
import { useCounter } from '@uidotdev/usehooks'

export function useVerifyEmail() {
	const { auth, isAuthenticated, isLoading } = useAuth()
	const [isSending, setIsSending] = useState(false)
	const [isChecking, setIsChecking] = useState(false)

	const [cooldown, { set: setCooldown, decrement }] = useCounter(0, {
		min: 0,
		max: 60,
	})

	useEffect(() => {
		if (cooldown <= 0) return
		const timer = setInterval(() => decrement(), 1000)
		return () => clearInterval(timer)
	}, [cooldown, decrement])

	const handleResend = async () => {
		if (cooldown > 0) return
		setIsSending(true)
		try {
			await toastUtil.promise(
				async () => {
					const data = await authService.resendVerification.post()
					if (data.error) {
						throw new Error(data.error)
					}
					setCooldown(60)
					return data
				},
				{
					loading: 'Sending verification email...',
					success: 'Verification email sent! Please check your inbox.',
					error: (err: any) => err?.message || 'Failed to resend email',
				}
			)
		} catch {
			// Error handled by toast promise
		} finally {
			setIsSending(false)
		}
	}

	const handleAlreadyVerified = async () => {
		setIsChecking(true)
		try {
			const checkVerificationPromise = (async () => {
				await adminAuth0Service.getVerifyEmailStatus.get().catch(() => {})
				const data = await authService.checkVerification.get()

				if (!data.verified) {
					throw new Error('Email is not verified yet. Please check your inbox and verify before continuing.')
				}
				return data
			})()

			toastUtil.promise(checkVerificationPromise, {
				loading: 'Checking verification status...',
				success: 'Email verified successfully! Redirecting...',
				error: (err: any) => err?.message || 'Failed to check verification status',
			})

			const data = await checkVerificationPromise

			if (data?.verified) {
				window.location.href = '/'
			}
		} catch {
			// Error handled by toast promise
		} finally {
			setIsChecking(false)
		}
	}

	return {
		auth,
		isAuthenticated,
		isLoading,
		isSending,
		isChecking,
		cooldown,
		handleResend,
		handleAlreadyVerified,
	}
}
