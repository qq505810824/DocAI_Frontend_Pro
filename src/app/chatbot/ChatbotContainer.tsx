'use client';

import Api from '@/apis';
import useAlert from '@/hooks/useAlert';
import useLoad from '@/hooks/useLoad';
import { encrypt } from '@/utils/util_crypto';
import useAxios from 'axios-hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import ChatbotView from './ChatbotView';

import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { deleteAction } from '../../swr/common'
import { getAllChatbotsFetcher, shareAuction } from '../../swr/chatbot'


const apiSetting = new Api();

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
    const [chatbots, setChatbots] = useState<Chatbots[]>([]);
    const [meta, setMeta] = useState<any>();
    const [visibleQRcode, setVisibleQRcode] = useState(false);
    const [qrcodeContent, setQrcodeContent] = useState<any>();
    // const [
    //     { data: showAllChatbotsData, loading: showAllChatbotsLoading, error: showAllChatbotsError },
    //     getAllChatbots
    // ] = useAxios({}, { manual: true });
    const { data: showAllChatbotsData, isLoading: getChatbotLoading }
        = useSWR({ page: page }, getAllChatbotsFetcher)

    useEffect(() => {
        setLoad({ show: false });
    }, [page]);

    useEffect(() => {
        if (searchParams) {
            setPage(parseInt(searchParams.get('page') || '1'));
        }
    }, [searchParams]);

    useEffect(() => {
        if (!getChatbotLoading && showAllChatbotsData?.success) {
            setChatbots(showAllChatbotsData.chatbots);
            setMeta(showAllChatbotsData.meta);
            setLoad({ show: false });
        } else if (showAllChatbotsData && !showAllChatbotsData?.success) {
            setAlert({ title: showAllChatbotsData.error, type: 'error' });
            setLoad({ show: false });
        }
    }, [getChatbotLoading]);


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
                meta,
                handleDeleteChatbot,
                handleShare,
                qrcodeContent,
                visibleQRcode,
                setVisibleQRcode
            }}
        />
    );
}

export default ChatbotContainer;
