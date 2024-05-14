import { del, get, post, put } from './base'
import type { Fetcher } from 'swr'

// useSWR('/api/v1/chatbots'}, getAction)
export const getAction: Fetcher<null, string> = (url) => {
  return get<null>(url)
}

// useSWR({ url: '/api/v1/chatbots', params: { page: 1 } }, getAction)
export const getActionWithParams: Fetcher<null, { url: string; params?: Record<string, any> }> = ({ url, params }) => {
  return get<null>(url, { params })
}

// 异步请求：async(e) =>{try{await putAction({ url: '/api/v1/users/me/profile', data: data }) }}
export const putAction: Fetcher<null, { url: string; data?: Record<string, any> }> = ({ url, data }) => {
  return put<null>(url, { body: data })
}

// export const profileUpdate: Fetcher<null, { date_of_birth: string; nickname: string; phone: string; position: string; sex: string }>
//   = ({ date_of_birth, nickname, phone, position, sex }) => {
//     return put<null>('/api/v1/users/me/profile', { body: { date_of_birth, nickname, phone, position, sex } })
//   }



