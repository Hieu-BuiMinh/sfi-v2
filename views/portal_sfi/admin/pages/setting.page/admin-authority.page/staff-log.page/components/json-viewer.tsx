'use client'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { IconButton, Typography, useColorScheme } from '@mui/material'
import JsonView from '@uiw/react-json-view'
import React from 'react'
import toast from '@/utils/toast'
import { vscodeTheme } from '@uiw/react-json-view/vscode'
import { lightTheme } from '@uiw/react-json-view/light'

interface JsonViewerProps {
  data: unknown
  label?: string
  initialExpanded?: boolean
}

import { useTranslations } from 'next-intl'

export function JsonViewer({ data, label }: JsonViewerProps) {
  const t = useTranslations('admin.settings.authority')
  const { mode } = useColorScheme()
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return (
      <Typography variant="caption" color="text.disabled">
        {t('messages.no_data')}
      </Typography>
    )
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    toast.success(t('messages.copied_to_clipboard'))
  }

  return (
    <div className="flex flex-col gap-1 max-w-full">
      {label && (
        <Typography
          variant="caption"
          className="font-bold text-gray-400 uppercase"
        >
          {label}
        </Typography>
      )}

      <div className="group relative p-2 rounded bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 transition-colors max-h-[300px] overflow-auto custom-scrollbar">
        <JsonView
          value={data as object}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          collapsed={true}
          style={{
            fontSize: '12px',
            backgroundColor: 'transparent',
            fontFamily: 'monospace',
            ...(mode === 'light' ? lightTheme : vscodeTheme),
          }}
        />

        <IconButton
          size="small"
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 bg-white/80 dark:bg-gray-900/80"
          onClick={handleCopy}
          title={t('messages.copy_json')}
        >
          <ContentCopyIcon sx={{ fontSize: '0.75rem' }} />
        </IconButton>
      </div>
    </div>
  )
}

export default JsonViewer
