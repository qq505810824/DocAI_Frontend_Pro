'use client';

import useAxios from 'axios-hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ShopView from './ShopView';

import useSWR from 'swr';
import { getActionWithParams } from '../../swr/common'

export default function ShopContainer() {
    const [open, setOpen] = useState(false);

    const { data: showAllChatbotsData, error: showAllChatbotsError, isLoading: showAllChatbotsLoading }
        = useSWR({ url: '/api/v1/chatbots', params: { page: 1 } }, getActionWithParams)

    return (
        <ShopView
            {...{
                open,
                setOpen,
                showAllChatbotsData
            }}
        />
    );
}
