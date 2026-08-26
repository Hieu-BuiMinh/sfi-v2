'use client'

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { Button } from '@mui/material'
import Link from 'next/link'

function AddLegalDocumentButton() {
	return (
		<Button
			component={Link}
			href="/settings/legal-documents/create"
			variant="contained"
			size="small"
			startIcon={<AddCircleOutlineRoundedIcon />}
		>
			New Entry
		</Button>
	)
}

export default AddLegalDocumentButton
