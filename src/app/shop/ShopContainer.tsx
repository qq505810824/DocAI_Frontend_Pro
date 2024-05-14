'use client';

import useAxios from 'axios-hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ShopView from './ShopView';

import useSWR from 'swr';
import { getAction } from '../../swr/common'

export default function ShopContainer() {
    const [open, setOpen] = useState(false);

    const { data: showAllChatbotsData, error: showAllChatbotsError, isLoading: showAllChatbotsLoading }
        = useSWR({ url: '/api/v1/chatbots', params: { page: 1 } }, getAction)

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
