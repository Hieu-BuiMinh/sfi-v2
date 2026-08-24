'use client'

import { UserRole } from '@/constants/sfi/user-roles.const'
import useProfile from '@/hooks/use-profile'
import { IUser } from '@/services/admin/me/me-res.dto'
import { useMemo } from 'react'

/**
 * Hook to check role slugs for a user (defaults to the current user profile).
 */
export function useRole(userParam?: IUser | null) {
	const { user, isLoading } = useProfile()

	const currentUser = userParam !== undefined ? userParam : user
	const userRoles = useMemo(() => currentUser?.roles || [], [currentUser])
	const roleSet = useMemo(() => new Set(userRoles), [userRoles])

	/**
	 * Checks if user has a specific role slug.
	 */
	const has = (role: UserRole): boolean => roleSet.has(role)

	/**
	 * Checks if user has ALL specified roles (AND condition).
	 */
	const hasAll = (roles: UserRole[]): boolean => {
		if (!roles || roles.length === 0) return false
		return roles.every((role) => has(role))
	}

	/**
	 * Checks if user has ANY of the specified roles (OR condition).
	 */
	const hasAny = (roles: UserRole[]): boolean => {
		if (!roles || roles.length === 0) return false
		return roles.some((role) => has(role))
	}

	return {
		user: currentUser,
		roles: userRoles,
		isLoading: userParam !== undefined ? false : isLoading,
		has,
		hasAll,
		hasAny,
	}
}

export default useRole
