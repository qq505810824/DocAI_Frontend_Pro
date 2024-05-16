import { del, get, post, put } from './base'
import type { CommonResponse } from './common'
import type { Fetcher } from 'swr'
import axios from 'axios';

//类型断言
type AllChatbotsResponse = {
  success: boolean;
  error: string;
  meta: any;
  chatbots: Chatbots[]
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
  success: boolean;
  chatbot: any;
  signature: string
}


// label
export const getAllChatbotsFetcher: Fetcher<AllChatbotsResponse, { page: string }> = (page) => {
  return get<AllChatbotsResponse>(`/api/v1/tags`, { page })
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
