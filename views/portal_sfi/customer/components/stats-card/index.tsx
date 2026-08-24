import React from 'react'
import { Box, Skeleton, Tooltip, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { cn } from '@/utils/cn'

type TValueTone = 'neutral' | 'positive' | 'negative'

export type SfiDashboardStatsCardProps = {
  title: React.ReactNode
  tooltip?: React.ReactNode
  icon?: React.ReactNode

  value: React.ReactNode
  unit?: React.ReactNode

  tone?: TValueTone // value color
  loading?: boolean

  className?: string
  onClick?: () => void
}

const toneClass: Record<TValueTone, string> = {
  neutral: 'text-text-primary',
  positive: 'text-success-main',
  negative: 'text-error-main',
}

export function SfiDashboardStatsCard({
  title,
  tooltip,
  icon,
  value,
  unit,
  tone = 'neutral',
  loading = false,
  className,
  onClick,
}: SfiDashboardStatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-4 rounded-md border border-mui-divider bg-common-background p-4 shadow-sm h-32',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-start w-full gap-3">
        <div className="size-10 flex items-center justify-center rounded-full bg-mui-primary-light-alpha/10 shrink-0">
          {loading ? (
            <Skeleton variant="circular" width={20} height={20} />
          ) : (
            icon
          )}
        </div>
        <div className="min-w-0">
          {loading ? (
            <Skeleton width={120} height={18} />
          ) : (
            <Typography
              variant="body2"
              className="line-clamp-1 truncate text-text-secondary"
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              {title}
            </Typography>
          )}
        </div>
        {!loading && tooltip ? (
          <Tooltip title={tooltip} arrow>
            <div className="text-text-disabled inline-flex shrink-0">
              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
            </div>
          </Tooltip>
        ) : null}
      </div>

      <div className="flex w-full items-baseline gap-2">
        {loading ? (
          <Skeleton width={120} height={32} />
        ) : (
          <>
            <Typography
              variant="h5"
              className={cn(
                'leading-none line-clamp-1 truncate min-w-0',
                toneClass[tone]
              )}
              sx={{ fontWeight: 800, letterSpacing: -0.3 }}
            >
              {value}
            </Typography>

            {unit ? (
              <Typography
                variant="body2"
                className="text-text-secondary line-clamp-1 truncate shrink-0 min-w-0"
                sx={{ fontWeight: 600 }}
              >
                {unit}
              </Typography>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
