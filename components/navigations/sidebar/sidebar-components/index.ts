import { SfiSidebarListAction } from './sfi-sidebar-list-action'
import { SfiSidebarListButton } from './sfi-sidebar-list-button'
import { SfiSidebarListCollapsible } from './sfi-sidebar-list-collapsible'
import { SfiSidebarListContent } from './sfi-sidebar-list-content'
import { SfiSidebarListDivider } from './sfi-sidebar-list-divider'
import { SfiSidebarListFooter } from './sfi-sidebar-list-footer'
import { SfiSidebarListGroup } from './sfi-sidebar-list-group'
import { SfiSidebarListHeader } from './sfi-sidebar-list-header'
import { SfiSidebarListItem } from './sfi-sidebar-list-item'
import { SfiSidebarListMenu } from './sfi-sidebar-list-menu'
import { SfiSidebarListRoot } from './sfi-sidebar-list-root'

export const SidebarListSfs = Object.assign(SfiSidebarListRoot, {
	Header: SfiSidebarListHeader,
	Content: SfiSidebarListContent,
	Footer: SfiSidebarListFooter,
	Group: SfiSidebarListGroup,
	Divider: SfiSidebarListDivider,
	Menu: SfiSidebarListMenu,
	MenuItem: SfiSidebarListItem,
	MenuButton: SfiSidebarListButton,
	MenuAction: SfiSidebarListAction,
	CollapsibleGroup: SfiSidebarListCollapsible,
})

export default SidebarListSfs
export * from './sfi-sidebar-list-context'
