import { del, get, post, put } from './base'
import type { Fetcher } from 'swr'


//类型断言
type getAllLabelsData = {
  tags: {
    id: string;
    name: string;
    taggings_count: number;
    updated_at: string;
    created_at: string;
  }[];
};

type CommonResponse = {
  success: boolean;
  errors: { name: string };
}

type LabelResponse = {
  success: boolean;
  tag: any;
  // {
  //   name: string;
  //   id: string;
  //   meta: { chain_features: string };
  //   functions: Array<{ id: string }>;
  // }
}


// label
export const getSmartExtractionSchemasByLabel: Fetcher<null, { id: string; page: string }> = ({ id, page }) => {
  return get<null>(`/api/v1/smart_extraction_schemas/label/${id}?page=${page}`)
}
export const getTagByIdFetcher: Fetcher<LabelResponse, string> = (id) => {
  return get<LabelResponse>(`/api/v1/tags/${id}`)
}


export const deleteAction: Fetcher<CommonResponse, { url: string, data?: Record<string, any> }> = ({ url, data }) => {
  return del<CommonResponse>(url, { body:data })
}


// useSWR('/api/v1/chatbots'}, getAction)
export const getAction: Fetcher<null, string> = (url) => {
  return get<null>(url)
}


export const postAction: Fetcher<CommonResponse, { url: string, data?: Record<string, any> }> = ({ url, data }) => {
  return post<CommonResponse>(url, { body:data })
}



export const getAllLabelsFetcher: Fetcher<getAllLabelsData, string> = (url) => {
  return get<getAllLabelsData>(url)
}


// useSWR({ url: '/api/v1/chatbots', params: { page: 1 } }, getActionWithParams)
export const getActionWithParams: Fetcher<null, { url: string; params?: Record<string, any> }> = ({ url, params }) => {
  return get<null>(url, { params })
}

// 异步请求：async(e) =>{try{await putAction({ url: '/api/v1/users/me/profile', data: data }) }}
export const putAction: Fetcher<null, { url: string; data?: Record<string, any> }> = ({ url, data }) => {
  return put<null>(url, { body: data })
}

export const loginFetcher: Fetcher<{ data: string }, { email: string, password: string }> = ({ email, password }) => {
  return post('/users/sign_in.json', { body: { user: { email, password } } })! as Promise<{ data: string }>
}

// export const loginFetcher: Fetcher<{ data: string }, { url: string; body: Record<string, any> }> = ({ url, body }) => {
//   return post(url, { body }) as Promise<{ data: string }>
// }

// export const profileUpdate: Fetcher<null, { date_of_birth: string; nickname: string; phone: string; position: string; sex: string }>
//   = ({ date_of_birth, nickname, phone, position, sex }) => {
//     return put<null>('/api/v1/users/me/profile', { body: { date_of_birth, nickname, phone, position, sex } })
//   }



