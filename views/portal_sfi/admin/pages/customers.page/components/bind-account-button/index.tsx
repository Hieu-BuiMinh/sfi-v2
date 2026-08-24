import { Button } from '@mui/material'
import React, { useState } from 'react'
import BindAccountDialog from './bind-account.dialog'

interface BindAccountButtonProps {
  email?: string
  applicationId?: string
}

function BindAccountButton({
  email = '',
  applicationId = '',
}: BindAccountButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        size="small"
        onClick={() => setOpen(true)}
      >
        Bind Account
      </Button>

      <BindAccountDialog
        open={open}
        onClose={() => setOpen(false)}
        initialData={{ email, applicationId }}
      />
    </>
  )
}

export default BindAccountButton
