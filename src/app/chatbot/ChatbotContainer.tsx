'use client';

import Api from '@/apis';
import useAlert from '@/hooks/useAlert';
import useLoad from '@/hooks/useLoad';
import { encrypt } from '@/utils/util_crypto';
import useAxios from 'axios-hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import ChatbotView from './ChatbotView';

import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { deleteAction } from '../../swr/common'
import { getAllChatbotsFetcher, getChatbotsFetcher, shareAuction, getKey } from '../../swr/chatbot'
import type { AllChatbotsResponse } from '../../swr/chatbot'

export interface Chatbots {
    chatbot: Chatbot;
    folders: any;
}

export interface Chatbot {
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

function ChatbotContainer() {
    const { setAlert } = useAlert();
    const { setLoad } = useLoad();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    // const [chatbots, setChatbots] = useState<Chatbots[]>([]);
    const [meta, setMeta] = useState<any>();
    const [visibleQRcode, setVisibleQRcode] = useState(false);
    const [qrcodeContent, setQrcodeContent] = useState<any>();
    const [searchKeywords, setSearchKeywords] = useState('')

    // const setKeywords = useCallback((keywords: string) => {
    //     setQuery(prev => ({ ...prev, keywords }))
    //   }, [setQuery])

    //dify的无限加载，修改：
    const { data: chatbots, isLoading, size, setSize, mutate } = useSWRInfinite(
        (pageIndex: number, previousPageData: AllChatbotsResponse) => {
            console.log('SWR中的page：', pageIndex)
            const url = getKey(pageIndex, previousPageData, searchKeywords)
            return url
        },
        getChatbotsFetcher,
        // { revalidateFirstPage: true },
    )
    const anchorRef = useRef<HTMLDivElement>(null)
    const hasMore = chatbots?.at(-1)?.has_more ?? true
    useEffect(() => {
        let observer: IntersectionObserver | undefined
        if (anchorRef.current) {
            observer = new IntersectionObserver((entries) => {
                console.log('条件判定：', entries[0].isIntersecting, !isLoading, hasMore)
                if (entries[0].isIntersecting && !isLoading && hasMore)
                    setSize((size: number) => size + 1)
            }, { rootMargin: '100px' })
            observer.observe(anchorRef.current)
        }
        return () => observer?.disconnect()
        //组件卸载或者不再需要观察元素时，调用该函数来断开 IntersectionObserver 的连接。
        //如果 observer 存在，那么调用 disconnect() 方法来断开观察器与目标元素之间的连接。
    }, [isLoading, setSize, anchorRef, mutate, hasMore])



    const { data: showAllChatbotsData, isLoading: showAllChatbotsLoading }
        = useSWR(`/api/v1/chatbots?page=${page}`, getAllChatbotsFetcher)


    useEffect(() => {
        setLoad({ show: false });
        // getAllChatbots(apiSetting.Chatbot.showAllChatbots(page));
    }, [page]);

    useEffect(() => {
        if (searchParams) {
            setPage(parseInt(searchParams.get('page') || '2'));
        }
    }, [searchParams]);

    useEffect(() => {
        if (!showAllChatbotsLoading && showAllChatbotsData?.success) {
            // setChatbots(showAllChatbotsData.chatbots);
            setMeta(showAllChatbotsData.meta);
            setLoad({ show: false });
        } else if (showAllChatbotsData && !showAllChatbotsData?.success) {
            setAlert({ title: showAllChatbotsData.error, type: 'error' });
            setLoad({ show: false });
        }
    }, [showAllChatbotsLoading]);


    const handleDeleteChatbot = useCallback(async (chatbot_id: string) => {
        setLoad({ show: true, content: '正在刪除數據...' });
        try {
            const res = await deleteAction({ url: `/api/v1/chatbots/${chatbot_id}` })
            if (res && res.success) {
                setAlert({ title: '删除成功!', type: 'success' });
                location.reload();
            }
        } catch (e) {
            setAlert({ title: e as string, type: 'error' });
        } finally {
            setLoad({ show: false });
        }
    }, [deleteAction])

    const handleShare = useCallback(async (chatbot: Chatbot, open?: boolean) => {
        setLoad({ show: true, content: '正在獲取連結...' });
        try {
            await shareAuction(`/api/v1/chatbots/${chatbot.id}/share`
            ).then((res) => {
                console.log(res)
                if (res.success) {
                    const decodedKey = atob(res.signature);
                    const encryptedText = encrypt(decodedKey);
                    const link =
                        process.env.NEXT_PUBLIC_CHATBOT_URL +
                        `${chatbot.id}?token_key=${encryptedText}`;

                    if (open) {
                        window.open(link);
                    } else {
                        setQrcodeContent({
                            ...chatbot,
                            link: link
                        });
                        setVisibleQRcode(true);
                    }
                }
            })
        } catch (e) {
            // setAlert({ title: e as string, type: 'error' });
        } finally {
            setLoad({ show: false });
        }
    }, [shareAuction])

    return (
        <ChatbotView
            {...{
                chatbots,
                handleDeleteChatbot,
                handleShare,
                qrcodeContent,
                visibleQRcode,
                setVisibleQRcode,
                anchorRef
            }}
        />
    );
}

export default ChatbotContainer;
