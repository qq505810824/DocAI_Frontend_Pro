'use client';

import Api from '@/apis';
import useAlert from '@/hooks/useAlert';
import useLoad from '@/hooks/useLoad';
import useAxios from 'axios-hooks';
import React, { useEffect, useState, useCallback } from 'react';
import LabelView from './LabelView';

import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr';
import { getAction, postAction, getAllLabelsFetcher } from '../../../swr/common'


const apiSetting = new Api();

function LabelContainer() {
    const [data, setData] = React.useState();
    const { setAlert } = useAlert();
    const [newLabelName, setNewLabelName] = useState('');
    const { setLoad } = useLoad();

    //  API数据对接区
    const [{ data: addNewLabelData, error: addNewLabelError }, addNewLabel] = useAxios(
        apiSetting.Tag.addNewTag(),
        { manual: true }
    );
    // const { data: addNewLabelData, error: addNewLabelError } = useSWR('/api/v1/tags', postAction)
    // const { mutate: addNewLabel } = useSWRMutation('/api/v1/tags', postAction)

    const [{ data: getAllLabelsData, loading: loading, error: getAllLabelsError }, getAllLabels] =
        useAxios(apiSetting.Tag.getAllTags(), { manual: true });
    const [{ data: tagTypes, error: getAllTagFunctionsError }, getAllTagFunctions] = useAxios(
        apiSetting.Tag.getTagFunctions(),
        { manual: false }
    );
    // const { data: getAllLabelsData, mutate: getAllLabels } = useSWR('/api/v1/tags', getAllLabelsFetcher)
    // const { data: tagTypes } = useSWR('/api/v1/functions', getAction)
    // const { mutate: updateTagFunctions } = useSWRMutation('/api/v1/tags/function', postAction)
    
    const [{ data: updateTagFunctionsData, error: updateTagFunctionsError }, updateTagFunctions] =
        useAxios(apiSetting.Tag.updateTagFunctions(), { manual: true });
    const [{ data: deleteTagFunctionsData, error: deleteTagFunctionsError }, deleteTagFunctions] =
        useAxios(apiSetting.Tag.deleteTagFunctions(), { manual: true });
    const [{ data: updateTagFeaturesData }, updateTagFeatures] = useAxios(
        apiSetting.Tag.updateTagFeatures(''),
        { manual: true }
    );
    const [
        { data: updateLabelNameByIdData, error: updateLabelNameByIdError },
        updateLabelNameById
    ] = useAxios(apiSetting.Tag.updateTagNameById(''), { manual: true });

    // useCallBack回调函数处理区
    const addNewLabelHandler = useCallback(async () => {
        // await addNewLabel(() => postAction({ url: '/api/v1/tags', data: { name: newLabelName, is_checked: true } }));
        await addNewLabel({ data: { name: newLabelName, is_checked: true } });
    }, [addNewLabel, newLabelName]);

    const updateLabelNameByIdHandler = useCallback(
        async (id: string, newName: string, is_checked?: boolean) => {
            updateLabelNameById({
                ...apiSetting.Tag.updateTagNameById(id),
                data: { name: newName, is_checked: is_checked }
            });
        },
        [updateLabelNameById]
    );

    // const newTask = { title: 'New Task' };
    // const createdTask = await mutate(() => createTask(newTask));
    // console.log(createdTask); // 处理创建的任务数据

    // const updateTagFunctionsHandler = useCallback(
    //     async (tag_id: string, function_id: string) => {
    //         if (function_id) {
    //             const res = await updateTagFunctions(() => postAction({ url: '/api/v1/tags/function', data: { tag_id: tag_id, function_id: function_id } }))
    //             console.log(res); // 处理创建的任务数据 
    //             // if (res.data.success) {
    //             //     setAlert({ title: '更新成功', type: 'success' });
    //             // } else {
    //             //     setAlert({ title: '更新失敗', type: 'error' });
    //             // }

    //         }
    //         // updateTagFunctions({
    //         //     data: { tag_id: tag_id, function_id: function_id }
    //         // }).then((res) => {
    //         //     if (res.data.success) {
    //         //         setAlert({ title: '更新成功', type: 'success' });
    //         //     } else {
    //         //         setAlert({ title: '更新失敗', type: 'error' });
    //         //     }
    //         // });
    //     },
    //     [updateTagFunctions]
    // );

    const updateTagFunctionsHandler = useCallback(
        async (tag_id: string, function_id: string) => {
            if (function_id)
                updateTagFunctions({
                    data: { tag_id: tag_id, function_id: function_id }
                }).then((res) => {
                    if (res.data.success) {
                        setAlert({ title: '更新成功', type: 'success' });
                    } else {
                        setAlert({ title: '更新失敗', type: 'error' });
                    }
                });
        },
        [updateTagFunctions]
    );

    const updateTagFeatureHandler = useCallback(
        async (tag_id: string, chain_feature_ids: []) => {
            updateTagFeatures({
                ...apiSetting.Tag.updateTagFeatures(tag_id),
                data: { chain_features: chain_feature_ids }
            }).then((res) => {
                if (res.data.success) {
                    setAlert({ title: '更新成功', type: 'success' });
                } else {
                    setAlert({ title: '更新失敗', type: 'error' });
                }
            });
        },
        [updateTagFeatures]
    );
    const deleteTagFunctionsHandler = useCallback(
        async (tag_id: string, function_id: string) => {
            if (function_id)
                deleteTagFunctions({
                    data: { tag_id: tag_id, function_id: function_id }
                });
        },
        [deleteTagFunctions]
    );

    // useEffect函数订阅区
    useEffect(() => {
        getAllLabels();
    }, [getAllLabels]);

    useEffect(() => {
        console.log('addNewLabelData', addNewLabelData)
        if (addNewLabelData && addNewLabelData.success) {
            setAlert({ title: '新增成功', type: 'success' });
            getAllLabels();
            // mutate(() => getAllLabelsFetcher('/api/v1/tags'))
            setNewLabelName('');
        } else if (addNewLabelData && !addNewLabelData.success) {
            setAlert({
                title: '新增失敗！',
                content: `原因：${addNewLabelData.errors.name[0]}`,
                type: 'error'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addNewLabelData]);

    useEffect(() => {
        if (updateLabelNameByIdData && updateLabelNameByIdData.success) {
            setAlert({ title: '更新成功', type: 'success' });
            getAllLabels();
            // mutate('/api/v1/tags')
        } else if (updateLabelNameByIdData && !updateLabelNameByIdData.success) {
            setAlert({
                title: '更新失敗！',
                content: `原因：${updateLabelNameByIdData.errors.name[0]}`,
                type: 'error'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateLabelNameByIdData]);

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
