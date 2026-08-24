'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/menu/base-menu'
import SfiNotiContent from '@/components/notification/noti-button/sfi-noti-content'
import { useAuth } from '@/hooks/use-auth'
import { adminNotificationService } from '@/services/admin/notifications'
import { INotification } from '@/services/admin/notifications/notifications-res.dto'
import { Badge, IconButton, SvgIconProps } from '@mui/material'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { useEffect } from 'react'

import NotificationsIcon from '@mui/icons-material/Notifications'

function SfiNotiButton() {
	const { auth } = useAuth()
	const userId = auth?.sub || ''
	const queryClient = useQueryClient()

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
		queryKey: adminNotificationService.getNotificationList.key({ userId }),
		queryFn: ({ pageParam = 1 }) =>
			adminNotificationService.getNotificationList.get({
				userId,
				page: pageParam,
				pageSize: 10,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const totalLoaded = allPages.reduce((total, page) => total + page.data.list.length, 0)
			return totalLoaded < lastPage.data.total ? allPages.length + 1 : undefined
		},
		enabled: !!userId,
	})

	const { mutate: markAsRead } = useMutation({
		mutationKey: adminNotificationService.markAsRead.key(),
		mutationFn: adminNotificationService.markAsRead.post,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: adminNotificationService.getNotificationList.key({ userId }),
			})
		},
	})

	const [infiniteScrollRef, intersectionEntry] = useIntersectionObserver<HTMLDivElement>()

	useEffect(() => {
		if (intersectionEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [intersectionEntry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

	const notifications = data?.pages.flatMap((page) => page.data.list) || []
	const unreadCount = data?.pages[0]?.data.total_unread || 0

	const handleReadNotification = (noti: INotification) => {
		if (!noti.checked) {
			markAsRead({
				notificationId: noti.id,
				authId: userId,
			})
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<IconButton size="small" aria-label="Notifications">
					<NotiIcon fontSize="small" notiAmount={unreadCount} />
				</IconButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-76 p-0!">
				<SfiNotiContent
					notifications={notifications}
					isLoading={isLoading}
					isFetchingNextPage={isFetchingNextPage}
					infiniteScrollRef={infiniteScrollRef}
					onReadNotification={handleReadNotification}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default SfiNotiButton
const NotiIcon = (props: SvgIconProps & { notiAmount?: number }) => {
	const { notiAmount, ...rest } = props
	return (
		<Badge
			badgeContent={notiAmount}
			max={99}
			color="error"
			invisible={!notiAmount || notiAmount <= 0}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			slotProps={{
				badge: {
					className: 'text-[10px] min-w-4 h-4 px-1',
				},
			}}
		>
			<NotificationsIcon {...rest} />
		</Badge>
	)
}
