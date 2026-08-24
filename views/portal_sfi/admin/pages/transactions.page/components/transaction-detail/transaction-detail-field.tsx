import React from 'react'
import { cn } from '@/utils/cn'

interface TransactionDetailFieldProps {
  label: string
  value: React.ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export default function TransactionDetailField({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: TransactionDetailFieldProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 min-w-0',
        className
      )}
    >
      <span className={cn('text-sm text-mui-text-secondary', labelClassName)}>
        {label}
      </span>
      <div
        className={cn(
          'text-sm font-medium text-mui-text-primary truncate min-w-0',
          valueClassName
        )}
        title={typeof value === 'string' ? value : undefined}
      >
        {value || '-'}
      </div>
    </div>
  )
}
