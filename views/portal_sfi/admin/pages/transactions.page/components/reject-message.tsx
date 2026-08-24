import { Typography } from '@mui/material'
import { cn } from '@/utils/cn'
import ErrorIcon from '@mui/icons-material/Error'

interface TransactionRejectMessageProps {
	message?: string | null
}

function TransactionRejectMessage({ message }: TransactionRejectMessageProps) {
	if (!message) return null

	return (
		<div
			className={cn(
				'mb-6 flex items-start gap-3 rounded-lg border p-3 transition-all duration-300',
				'border-red-100 bg-red-50/50 dark:border-red-500/20 dark:bg-red-500/5',
				'animate-in fade-in slide-in-from-top-2'
			)}
		>
			<div className="flex shrink-0 items-center justify-center rounded-full bg-red-100 p-1.5 dark:bg-red-500/10">
				<ErrorIcon fontSize="small" className="text-red-600 dark:text-red-400" />
			</div>
			<div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
				<Typography
					variant="caption"
					className="text-[9px] font-bold tracking-widest text-red-700 uppercase dark:text-red-400"
				>
					Rejection Reason
				</Typography>
				<Typography
					variant="caption"
					className="text-[11px] leading-relaxed wrap-break-word whitespace-pre-wrap text-red-900/90 dark:text-red-200/80"
				>
					{message}
				</Typography>
			</div>
		</div>
	)
}

export default TransactionRejectMessage
