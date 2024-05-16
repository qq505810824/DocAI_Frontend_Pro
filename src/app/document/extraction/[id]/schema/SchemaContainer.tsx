'use client';

import useAxios from 'axios-hooks';
import _ from 'lodash';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Api from '../../../../../apis';
import useAlert from '../../../../../hooks/useAlert';
import SchemaView from './SchemaView';

import useSWR from 'swr';
import { postAction, putAction } from '../../../../../swr/common'
import { getTagByIdFetcher, getSmartExtractionSchemasByIdFetcher } from '../../../../../swr/label'

export default function SchemaContainer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = useParams();
    const { setAlert } = useAlert();
    const [open, setOpen] = useState(false);
    const [actionContent, setActionContent] = useState('');
    const [extractSchema, setExtractSchema] = useState({
        name: '',
        description: '',
        label_id: '',
        schema: [],
        data_schema: {}
    });
    const [visableAdd, setVisableAdd] = useState(true);
    const [label, setLabel] = useState();


    const getTagById = async (id: string) => {
        try {
            const res = await getTagByIdFetcher(id)
            if (res && res.success) {
                setLabel(res.tag);
            }
        } catch (e) { }
    }

    const getSmartExtractionSchemasById = useCallback(async (id: string) => {
        setOpen(true);
        try {
            const res = await getSmartExtractionSchemasByIdFetcher(id)
            if (res && res.success)
                setExtractSchema({
                    name: res.smart_extraction_schema?.name,
                    description: res.smart_extraction_schema?.description,
                    label_id: res.smart_extraction_schema?.label_id,
                    schema: res.smart_extraction_schema?.schema,
                    data_schema: res.smart_extraction_schema?.data_schema
                });
        } finally {
            setOpen(false);
        }
    }, [getSmartExtractionSchemasByIdFetcher])

    const createSmartExtractionSchemas = useCallback(async (data: Record<string, any>) => {
        setOpen(true);
        try {
            const res = await postAction({
                url: `/api/v1/smart_extraction_schemas`,
                data: data
            })
            if (res && res.success)
                setAlert({ title: '創建成功', type: 'success' });
        } catch (e) {
            setAlert({ title: '創建失敗', type: 'error' });
            console.log(e);
        } finally {
            setOpen(false);
        }
    }, [postAction])

    const updateSmartExtractionSchemasById = useCallback(async (id: string, data: Record<string, any>) => {
        setOpen(true);
        try {
            const res = await putAction({
                url: `/api/v1/smart_extraction_schemas/${id}`,
                data: data
            })
            if (res && res.success)
                setAlert({ title: '保存成功', type: 'success' });
        } catch (e) {
            setAlert({ title: e as string, type: 'error' });
            console.log(e);
        } finally {
            setOpen(false);
        }
    }, [putAction])

    useEffect(() => {
        setActionContent('正在加載數據');
        if (router && id) {
            console.log('id', id);
            getTagById(id as string);
            setExtractSchema({
                ...extractSchema,
                label_id: id.toString()
            });
        }
        if (router && searchParams.get('schema_id')) {
            // setVisableAdd(false);
            getSmartExtractionSchemasById(searchParams.get('schema_id') as string);
        }
    }, [router]);

    const handleSave = () => {
        const data_schema: any = {};
        extractSchema.schema?.map((s: any) => {
            data_schema[s.key] = '';
        });
        extractSchema.data_schema = data_schema;
        if (_.isEmpty(data_schema)) {
            setAlert({ title: '請添加Column', type: 'warning' });
            return;
        }
        setActionContent('正在保存數據,等待時間較長，請耐心等候...');
        if (router && searchParams.get('schema_id')) {
            updateSmartExtractionSchemasById(
                searchParams.get('schema_id') as string,
                extractSchema
            );
        } else {
            createSmartExtractionSchemas(extractSchema);
        }
    };

    return (
        <SchemaView
            {...{
                label,
                open,
                setOpen,
                extractSchema,
                setExtractSchema,
                handleSave,
                actionContent,
                visableAdd
            }}
        />
    );
}
