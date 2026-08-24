import React from 'react'
import { cn } from '@/utils/cn'
import { Tooltip, Button } from '@mui/material'
import { formatMoney, formatNumber } from '@/utils/money'

interface SummaryCardProps {
  title: string
  count: number | string
  subtitle: string
  buttonLabel: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export const SummaryCard = ({
  title,
  count,
  subtitle,
  buttonLabel,
  icon,
  onClick,
  disabled,
}: SummaryCardProps) => {
  const formattedCount = formatNumber(count, { digits: 0 })

  return (
    <div className="flex min-h-[190px] flex-col gap-5 justify-between rounded-md border border-mui-divider bg-common-background px-5 py-5 shadow-sm">
      <Tooltip title={title} placement="top-start">
        <h3 className="text-base font-semibold leading-tight text-mui-text-primary md:text-xl line-clamp-1 truncate">
          {title}
        </h3>
      </Tooltip>

      <div className="flex items-center gap-2">
        <div className="text-mui-text-secondary">{icon}</div>
        <Tooltip title={formattedCount} placement="top-start">
          <span className="text-xl font-black leading-none text-mui-primary md:text-3xl line-clamp-1 truncate">
            {formattedCount}
          </span>
        </Tooltip>
      </div>

      <Tooltip title={subtitle} placement="top-start">
        <p className="text-[15px] leading-6 text-token-muted-foreground line-clamp-1 truncate">
          {subtitle}
        </p>
      </Tooltip>

      <Button
        onClick={onClick}
        disabled={disabled}
        fullWidth
        variant="contained"
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
