import { del, get, post, put } from './base'
import type { Fetcher } from 'swr'

export const getAction: Fetcher<null, { url: string; params?: Record<string, any> }> = ({ url, params }) => {
  return get<null>(url, { params })
}