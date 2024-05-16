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

type LabelResponse = {
  success: boolean;
  tag: any;
}

type SmartExtractionSchemasResponse = {
  success: boolean;
  meta: any;
  smart_extraction_schema: any;
}

// label
export const getSmartExtractionSchemasByLabelFetcher: Fetcher<SmartExtractionSchemasResponse, { id: string; page: number }> = ({ id, page }) => {
  return get<SmartExtractionSchemasResponse>(`/api/v1/smart_extraction_schemas/label/${id}?page=${page}`)
}
export const getSmartExtractionSchemasByIdFetcher: Fetcher<SmartExtractionSchemasResponse, string> = ( id ) => {
  return get<SmartExtractionSchemasResponse>(`/api/v1/smart_extraction_schemas/${id}`)
}

export const getTagByIdFetcher: Fetcher<LabelResponse, string> = (id) => {
  return get<LabelResponse>(`/api/v1/tags/${id}`)
}

export const getAllLabelsFetcher: Fetcher<getAllLabelsData, string> = (url) => {
  return get<getAllLabelsData>(url)
}
