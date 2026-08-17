import { Theme } from '@mui/material/styles'
import { sfiOnboardTheme } from './sfi'

export const themesRegistry: Record<string, Theme> = {
	sfi: sfiOnboardTheme,
	default: sfiOnboardTheme,
}

export { sfiOnboardTheme }
