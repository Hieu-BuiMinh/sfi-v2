'use client'

import { Button } from '@mui/material'
import { useVerifyEmail } from '@/views/landing-page_sfi/hooks/use-verify-email'

function VerifyEmailPageView() {
	const { auth, cooldown, isChecking, isSending, handleAlreadyVerified, handleResend } = useVerifyEmail()

	return (
		<div className="flex w-full flex-1 flex-col items-center justify-center p-6 text-center">
			<div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
				<h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
				<p className="mt-3 text-sm text-gray-600">
					We sent a verification email to:
					<br />
					<span className="font-semibold text-gray-800">{auth?.email || 'your email'}</span>
				</p>
				<p className="mt-2 text-xs text-gray-500">
					Please click the link in the email to verify your account, then click the button below.
				</p>

				<div className="mt-6 flex flex-col gap-3">
					<Button
						variant="outlined"
						fullWidth
						onClick={handleResend}
						disabled={isSending || isChecking || cooldown > 0}
						loading={isSending}
					>
						{isSending ? 'Resending...' : cooldown > 0 ? `Resend Email (${cooldown}s)` : 'Resend Email'}
					</Button>
					<Button
						variant="contained"
						fullWidth
						onClick={handleAlreadyVerified}
						disabled={isChecking || isSending}
						loading={isChecking}
					>
						{isChecking ? 'Checking...' : "I've Verified My Email"}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default VerifyEmailPageView
