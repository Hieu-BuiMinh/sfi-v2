import SfiTabs, { SfiTabItem } from '@/components/tab/sfi-tab-default'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import EmailWorkspace from './email-workspace'
import RevisionHistory from './revision-history'

const TABS: SfiTabItem[] = [
	{
		key: 'email-workspace',
		label: 'Email Workspace',
		icon: <MailOutlineRoundedIcon fontSize="small" />,
		content: <EmailWorkspace />,
	},
	{
		key: 'revision-history',
		label: 'Revision History',
		icon: <HistoryRoundedIcon fontSize="small" />,
		content: <RevisionHistory />,
	},
]

function EmailTemplateWorkspace() {
	return <SfiTabs items={TABS} defaultKey="email-workspace" />
}

export default EmailTemplateWorkspace
