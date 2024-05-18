import { del, get, post, put } from './base'
import type { CommonResponse } from './common'
import type { Fetcher } from 'swr'
import axios from 'axios';

//类型断言
export type AllChatbotsResponse = {
  chatbots: Chatbots[];
  success: boolean;
  error: string;
  meta: any;
}

type Chatbots = {
  chatbot: Chatbot;
  folders: any;
}
type Chatbot = {
  id: string;
  name: string;
  description: string;
  user_id: string;
  category: string;
  meta: any;
  source: {
    folder_id: string[];
  };
  created_at: string;
  updated_at: string;
}
type sharePromise = {
  chatbot: any;
  success: boolean;
  signature: string
}

export const getKey = (
  pageIndex: number,
  previousPageData: AllChatbotsResponse,
  // activeTab: string,
  // tags: string[],
  keywords: string,
) => {
  if (pageIndex == 0) {
    const params: any = { url: '/api/v1/chatbots', params: { page: 1, limit: 30, name: keywords } }
    return params
  } else if (pageIndex > 0 || previousPageData?.meta.next_page) {
    const params: any = { url: '/api/v1/chatbots', params: { page: pageIndex + 1, limit: 30, name: keywords } }
    return params
  }
  // if (pageIndex >= 0 || previousPageData?.has_more) {
  //   const params: any = { url: '/api/v1/chatbots', params: { page: 1, limit: 30, name: keywords } }
  //   return params
  // } else if (pageIndex > 0 || previousPageData?.meta.next_page) {
  //   const params: any = { url: '/api/v1/chatbots', params: { page: pageIndex + 1, limit: 30, name: keywords } }
  //   return params
  // }
  return null
}

export const getChatbotsFetcher: Fetcher<AllChatbotsResponse, { url: string; params?: Record<string, any> }> = ({ url, params }) => {
  return get<AllChatbotsResponse>(url, { params })
}


export const getAllChatbotsFetcher: Fetcher<AllChatbotsResponse, string> = (url) => {
  return get<AllChatbotsResponse>(url)
}


export const shareAuction = async (url: string) => {
  return post(url) as Promise<sharePromise>
}

// export const postAction: Fetcher<CommonResponse, { url: string, data?: Record<string, any> }> = ({ url, data }) => {
//   return new Promise((resolve, reject) => {
//     post<CommonResponse>(url, { body: data })
//       .then(response => {
//         resolve(response);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// };



// export const getAllLabelsFetcher: Fetcher<getAllLabelsData, string> = (url) => {
//   return get<getAllLabelsData>(url)
// }
