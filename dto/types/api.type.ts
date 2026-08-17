/* eslint-disable @typescript-eslint/no-explicit-any */
export type TApiResponse<T> = {
	status: string
	code: number
	message: string
	data: T
}

export type TApiListResponse<T> = {
	status: string
	code: number
	message: string
	data: {
		status: string
		code: number
		message: string
		current_page: number
		data: T[]
		first_page_url: string
		from: number
		last_page: number
		last_page_url: string
		links: {
			url?: string
			label: string
			active: boolean
		}[]
		next_page_url: any
		path: string
		per_page: number
		prev_page_url: any
		to: number
		total: number
	}
}
