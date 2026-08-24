import { INotification } from '@/services/admin/notifications/notifications-res.dto'
import { cn } from '@/utils/cn'
import { CircularProgress, SvgIconProps } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import { RefCallback } from 'react'

interface SfiNotiContentProps {
	notifications: INotification[]
	isLoading: boolean
	isFetchingNextPage: boolean
	infiniteScrollRef: RefCallback<HTMLDivElement>
	onReadNotification: (noti: INotification) => void
}

function SfiNotiContent({
	notifications,
	isLoading,
	isFetchingNextPage,
	infiniteScrollRef,
	onReadNotification,
}: SfiNotiContentProps) {
	const t = useTranslations('components.noti')
	return (
		<div className="text-mui-text-primary flex max-h-96 w-76 flex-col">
			<p className="border-mui-divider shrink-0 border-b px-3 py-2 text-sm font-semibold">{t('title')}</p>

			<div className={cn('flex-1 overflow-y-auto', notifications.length === 0 && 'flex min-h-12 items-center')}>
				{isLoading ? (
					<div className="flex w-full justify-center p-4">
						<CircularProgress size={20} />
					</div>
				) : notifications.length > 0 ? (
					<div className="flex flex-col">
						{notifications.map((noti) => (
							<NotiItem key={noti.id} noti={noti} onClick={() => onReadNotification(noti)} />
						))}

						<div ref={infiniteScrollRef} className="flex h-10 items-center justify-center">
							{isFetchingNextPage && <CircularProgress size={20} />}
						</div>
					</div>
				) : (
					<div className="text-mui-primary px-3 py-2 text-sm">{t('no_notifications')}</div>
				)}
			</div>
		</div>
	)
}

export default SfiNotiContent

const NotiItem = ({ noti, onClick }: { noti: INotification; onClick: () => void }) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				'dark:hover:bg-mui-bg-default border-mui-divider flex w-full cursor-pointer gap-2 border-b p-3 transition-colors duration-300 hover:bg-[#EEF5FC]',
				!noti.checked && 'bg-blue-50/50 dark:bg-blue-900/10'
			)}
		>
			<div className="flex size-6 shrink-0 items-center justify-center">
				{noti.checked ? (
					<NotiRead key={noti.id} className="text-mui-primary dark:text-token-muted-foreground" />
				) : (
					<NotiNotRead key={noti.id} className="text-mui-primary dark:text-token-muted-foreground" />
				)}
			</div>
			<div className="flex flex-col gap-1">
				<div className="text-sm leading-tight font-medium">{noti.title}</div>
				<div className="text-token-muted-foreground line-clamp-2 text-xs">{noti.body}</div>
				<p className="text-token-muted-foreground text-[10px]">
					{dayjs(noti.createdAt).format('DD MMMM YYYY, HH:mm')}
				</p>
			</div>
		</div>
	)
}

const NotiRead = (props: SvgIconProps) => {
	return (
		<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M0 14.2128C0 22.0464 6.36477 28.4113 14.1984 28.4113C22.032 28.4113 28.4112 22.0464 28.4112 14.2128C28.4112 6.3792 22.032 0 14.1984 0C6.36477 0 0 6.37919 0 14.2128ZM19.9872 9.86406C20.5487 10.4257 20.5487 11.3472 19.9872 11.9088L13.3487 18.5472C13.0751 18.8208 12.7008 18.9649 12.3264 18.9649C11.9664 18.9649 11.592 18.8208 11.3184 18.5472L8.40955 15.6528C7.84802 15.0913 7.84802 14.1696 8.40955 13.608C8.98559 13.0464 9.89279 13.0464 10.4544 13.608L12.3264 15.4944L17.9568 9.86406C18.5184 9.30243 19.4256 9.30243 19.9872 9.86406Z"
				fill="#3758F9"
			/>
		</svg>
	)
}
const NotiNotRead = (props: SvgIconProps) => {
	return (
		<svg
			focusable="false"
			aria-hidden="true"
			viewBox="0 0 24 24"
			data-testid="ReportIcon"
			fill="currentColor"
			className={cn('size-6', props.className)}
			{...props}
		>
			<path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3m1-4.3h-2V7h2z"></path>
		</svg>
	)
}
