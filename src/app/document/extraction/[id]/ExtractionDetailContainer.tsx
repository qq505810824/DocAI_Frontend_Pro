'use client';
import { useRouter, useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getAllChainFeatureDatas } from '../../../../apis/AirtableChainFeature';
import useAlert from '../../../../hooks/useAlert';
import ExtractionDetailView from './ExtractionDetailView';

import useSWR from 'swr';
import { deleteAction, postAction, putAction, getAction } from '../../../../swr/common'
import { getTagByIdFetcher, getSmartExtractionSchemasByLabelFetcher } from '../../../../swr/label'

export default function ExtractionDetailContainer() {
    const router = useRouter();
    const { id } = useParams();
    const { setAlert } = useAlert();
    const [label, setLabel] = useState<any>();
    const [meta, setMeta] = useState();
    const [page, setPage] = useState(1);
    const [chain_features, set_chain_features] = useState<any>([]);
    const [smart_extraction_schemas, set_smart_extraction_schemas] = useState<any>([]);


    //数据提取，填表，推荐功能 ———— MUI中不需要判断TypeValue
    // const [currentTypeTab, setCurrentTypeTab] = useState<
    //     'extraction' | 'form_filling' | 'chain_feature'
    // >('extraction');

    const { data: tagTypes, error } = useSWR('/api/v1/functions', getAction);

    useEffect(() => {
        if (router && id) {
            getAllSmartExtractionSchemas(id as string, page);
            getTagById(id as string);
            getAllChainFeatureDatas().then((datas) => {
                set_chain_features(datas);
            });
        }
    }, [router]);

    const getAllSmartExtractionSchemas = async (id: string, page = 1) => {
        try {
            const res = await getSmartExtractionSchemasByLabelFetcher({id, page})
            if (res && res.success) {
                set_smart_extraction_schemas(res.smart_extraction_schema);
                setMeta(res.meta);
            }
        } catch (e) { }
    }

    const getTagById = async (id: string) => {
        try {
            const res = await getTagByIdFetcher(id)
            if (res && res.success) {
                setLabel(res.tag);
            }
        } catch (e) { }
    }

    const updateTagFeatureHandler = useCallback(async (tag_id: string, chain_feature_ids: []) => {
        try {
            await putAction({
                url: `/api/v1/tags/${tag_id}/features`,
                data: { chain_features: chain_feature_ids }
            })
            setAlert({ title: '更新成功', type: 'success' });
        } catch (e) {
            setAlert({ title: '更新失敗', type: 'error' });
        }
    }, [putAction])

    const updateTagNameHandler = useCallback(async (tag_id: string, tag_name: string) => {
        try {
            await putAction({
                url: `/api/v1/tags/${tag_id}`,
                data: { name: tag_name }
            })
            setAlert({ title: '更新成功', type: 'success' });
        } catch (e) {
            setAlert({ title: '更新失敗', type: 'error' });
        }
    }, [putAction])

    const updateTagFunctionsHandler = useCallback(async (tag_id: string, function_id: string) => {
        if (function_id)
            try {
                await postAction({
                    url: '/api/v1/tags/function',
                    data: { tag_id: tag_id, function_id: function_id }
                })
                setAlert({ title: '更新成功', type: 'success' });
            } catch (e) {
                setAlert({ title: '更新失敗', type: 'error' });
            }
    }, [postAction])

    const deleteTagFunctionsHandler = useCallback(async (tag_id: string, function_id: string) => {
        if (function_id)
            try {
                await deleteAction({
                    url: '/api/v1/tags/function',
                    data: { tag_id: tag_id, function_id: function_id }
                })
                setAlert({ title: '更新成功', type: 'success' });
            } catch (e) {
                setAlert({ title: '更新失敗', type: 'error' });
            }
    }, [deleteAction])

    return (
        <ExtractionDetailView
            {...{
                label,
                // currentTypeTab,
                // setCurrentTypeTab,
                smart_extraction_schemas,
                meta,
                chain_features,
                updateTagFeatureHandler,
                updateTagNameHandler,
                updateTagFunctionsHandler,
                deleteTagFunctionsHandler,
                tagTypes
            }}
        />
    );
}
