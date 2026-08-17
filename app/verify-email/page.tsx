/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-location-assign-relative-destination */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { toastUtil } from '@/utils/toast'
import { Toaster } from 'sonner'

export default function VerifyEmailPage() {
	const { auth, isLoading } = useAuth()
	const [isSending, setIsSending] = useState(false)
	const [isChecking, setIsChecking] = useState(false)

	const checkVerificationStatus = useCallback(async (showToastOnPending = false) => {
		try {
			setIsChecking(true)
			const res = await fetch('/api/auth/check-verification', {
				cache: 'no-store',
			})
			const data = await res.json()

			if (data?.verified) {
				toastUtil.success('Email verified successfully! Redirecting to home...')
				setTimeout(() => {
					window.location.href = '/'
				}, 1000)
			} else if (showToastOnPending) {
				toastUtil.info('Email is not verified yet. Please check your inbox.')
			}
		} catch {
			// Ignore background check errors silently
		} finally {
			setIsChecking(false)
		}
	}, [])

	// Auto check when window regains focus (auth returns from email client tab)
	useEffect(() => {
		const onFocus = () => {
			checkVerificationStatus(true)
		}

		window.addEventListener('focus', onFocus)
		return () => window.removeEventListener('focus', onFocus)
	}, [checkVerificationStatus])

	const handleResend = async () => {
		setIsSending(true)
		const toastId = toastUtil.loading('Sending verification email...')

		try {
			const res = await fetch('/api/auth/resend-verification', {
				method: 'POST',
			})
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || 'Failed to resend email')
			}

			toastUtil.dismiss(toastId)
			toastUtil.success('Verification email sent! Please check your inbox.')
		} catch (err: any) {
			toastUtil.dismiss(toastId)
			toastUtil.error(err.message || 'Something went wrong while sending email')
		} finally {
			setIsSending(false)
		}
	}

	const handleAlreadyVerified = async () => {
		const toastId = toastUtil.loading('Checking verification status...')

		try {
			const res = await fetch('/api/auth/check-verification', {
				cache: 'no-store',
			})
			const data = await res.json()

			toastUtil.dismiss(toastId)

			if (data?.verified) {
				toastUtil.success('Email is verified! Redirecting...')
				setTimeout(() => {
					window.location.href = '/'
				}, 1000)
			} else {
				toastUtil.warning('Email is not verified yet. Please check your inbox or resend email.')
			}
		} catch {
			toastUtil.dismiss(toastId)
			toastUtil.error('Failed to check status. Please try again.')
		}
	}

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-zinc-500">Loading...</p>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
			<div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mb-2 flex items-center gap-2">
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Verify your email address</h1>
					{isChecking && (
						<span className="animate-pulse text-xs font-medium text-blue-500">(Checking...)</span>
					)}
				</div>

				<p className="mb-6 text-zinc-600 dark:text-zinc-400">
					We have sent a verification link to{' '}
					<strong className="text-zinc-900 dark:text-zinc-200">{auth?.email}</strong>. Please check your email
					and follow the instructions to complete registration.
				</p>

				<div className="flex flex-col gap-3">
					<button
						onClick={handleAlreadyVerified}
						className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
					>
						I&apos;ve Already Verified
					</button>

					<button
						onClick={handleResend}
						disabled={isSending}
						className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						{isSending ? 'Sending...' : 'Resend Verification Email'}
					</button>

					<a
						href="/auth/logout"
						className="mt-2 text-center text-sm text-zinc-500 hover:underline dark:text-zinc-400"
					>
						Log out
					</a>
				</div>
			</div>
			<Toaster position="top-right" richColors />
		</div>
	)
}
