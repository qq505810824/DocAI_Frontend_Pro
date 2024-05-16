import { del, get, post, put } from './base'
import type { Fetcher } from 'swr'

//类型断言
export type CommonResponse = {
  success: boolean;
  errors: { name: string };
}

// useSWR('/api/v1/chatbots'}, getAction)
export const getAction: Fetcher<CommonResponse, string> = (url) => {
  return get<CommonResponse>(url)
}

export const postAction: Fetcher<CommonResponse, { url: string, data?: Record<string, any> }> = ({ url, data }) => {
  return post<CommonResponse>(url, { body: data })
}

// useSWR({ url: '/api/v1/chatbots', params: { page: 1 } }, getActionWithParams)
export const getActionWithParams: Fetcher<null, { url: string; params?: Record<string, any> }> = ({ url, params }) => {
  return get<null>(url, { params })
}

// 异步请求：async(e) =>{try{await putAction({ url: '/api/v1/users/me/profile', data: data }) }}
export const putAction: Fetcher<CommonResponse, { url: string; data?: Record<string, any> }> = ({ url, data }) => {
  return put<CommonResponse>(url, { body: data })
}

export const deleteAction: Fetcher<CommonResponse, { url: string, data?: Record<string, any> }> = ({ url, data }) => {
  return del<CommonResponse>(url, { body: data })
}

export const loginFetcher: Fetcher<{ data: string }, { email: string, password: string }> = ({ email, password }) => {
  return post('/users/sign_in.json', { body: { user: { email, password } } })! as Promise<{ data: string }>
}
