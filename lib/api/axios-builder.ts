import type {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
	RawAxiosRequestHeaders,
} from 'axios'
import axios from 'axios'

export class AxiosBuilder {
	private instance: AxiosInstance

	constructor() {
		this.instance = axios.create()
	}

	public setBaseUrl(baseURL: AxiosInstance['defaults']['baseURL']) {
		this.instance.defaults.baseURL = baseURL
		return this
	}

	public setHeaders(headers: RawAxiosRequestHeaders) {
		this.instance.defaults.headers.common = {
			...this.instance.defaults.headers.common,
			...headers,
		}
		return this
	}

	public addRequestInterceptor(
		interceptor: (
			value: InternalAxiosRequestConfig
		) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
	) {
		this.instance.interceptors.request.use(interceptor)
		return this
	}

	public setApiResponseInterceptor(interceptor: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>) {
		this.instance.interceptors.response.use(interceptor, undefined)
		return this
	}

	public setApiResponseErrorInterceptor(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		interceptor: (error: import('axios').AxiosError) => Promise<never> | any
	) {
		this.instance.interceptors.response.use(undefined, interceptor)
		return this
	}

	public setToken(token: string) {
		if (token) {
			this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
		}
		return this
	}

	public async get<T>({ url, config }: { url: string; config?: AxiosRequestConfig }): Promise<AxiosResponse<T>> {
		return await this.instance.get(url, config)
	}

	public async post<T, D = unknown>({
		data,
		url,
		config,
	}: {
		url: string
		data?: D
		config?: AxiosRequestConfig
	}): Promise<AxiosResponse<T>> {
		return await this.instance.post(url, data, config)
	}

	public async put<T, D = unknown>({
		data,
		url,
		config,
	}: {
		url: string
		data?: D
		config?: AxiosRequestConfig
	}): Promise<AxiosResponse<T>> {
		return await this.instance.put(url, data, config)
	}

	public async patch<T, D = unknown>({
		data,
		url,
		config,
	}: {
		url: string
		data?: D
		config?: AxiosRequestConfig
	}): Promise<AxiosResponse<T>> {
		return await this.instance.patch(url, data, config)
	}

	public async delete<T>({ url, config }: { url: string; config?: AxiosRequestConfig }): Promise<AxiosResponse<T>> {
		return await this.instance.delete(url, config)
	}

	public build(): AxiosInstance {
		return this.instance
	}
}
