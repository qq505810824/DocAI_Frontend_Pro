'use client';

import Api from '@/apis';
import useAlert from '@/hooks/useAlert';
import useLoad from '@/hooks/useLoad';
import useAxios from 'axios-hooks';
import React, { useEffect, useState, useCallback } from 'react';
import LabelView from './LabelView';

import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr';
import { deleteAction, postAction, putAction, getAction } from '../../../swr/common'
// import { getAllLabelsFetcher } from '../../../swr/label'


const apiSetting = new Api();

function LabelContainer() {
    const [data, setData] = React.useState();
    const { setAlert } = useAlert();
    const [newLabelName, setNewLabelName] = useState('');
    const { setLoad } = useLoad();

    //  API数据对接区
    const { data: tagTypes } = useSWR(`/api/v1/functions`, getAction)
    const { data: getAllLabelsData, mutate: getAllLabels } = useSWR('/api/v1/tags', getAction)
    const { data: addNewLabelData } = useSWR('/api/v1/tags', postAction)

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
                // setAlert({ title: '更新成功', type: 'success' });
            } catch (e) {
                // setAlert({ title: '更新失敗', type: 'error' });
            }
    }, [deleteAction])

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

    const updateLabelNameByIdHandler = useCallback(async (id: string, newName: string, is_checked?: boolean) => {
        try {
            const rest = await putAction({
                url: `/api/v1/tags/${id}`,
                data: { name: newName, is_checked: is_checked }
            })
            setAlert({ title: '更新成功', type: 'success' });
            getAllLabels();
        } catch (e) {
            setAlert({
                title: '更新失敗！',
                content: `原因：${e}`,
                // content: `原因：${res.errors.name[0]}`,
                type: 'error'
            });
        }
    }, [putAction])

    const addNewLabelHandler = useCallback(async () => {
        try {
            await postAction({
                url: '/api/v1/tags',
                data: { name: newLabelName, is_checked: true }
            }
            );
            setAlert({ title: '新增成功', type: 'success' });
            getAllLabels();
            setNewLabelName('');
        } catch (e) {
            setAlert({
                title: '新增失敗！',
                content: `原因：${e}`,
                // content: `原因：${addNewLabelData.errors.name[0]}`,
                type: 'error'
            });
        }
    }, [postAction, newLabelName]);

    // useEffect函数订阅区
    useEffect(() => {
        getAllLabels();
    }, [getAllLabels]);

    return (
        <LabelView
            {...{
                getAllLabelsData,
                addNewLabelHandler,
                addNewLabelData,
                newLabelName,
                setNewLabelName,
                updateLabelNameByIdHandler,
                tagTypes,
                updateTagFunctionsHandler,
                deleteTagFunctionsHandler,
                updateTagFeatureHandler
            }}
        />
    );
}

export default LabelContainer;
