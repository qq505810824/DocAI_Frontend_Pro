import ChatbotList from '@/components/Chatbot/ChatbotList';
import ChatbotTable from '@/components/Chatbot/ChatbotTable';
import ShareQRcodeModal from '@/components/Chatbot/feature/ShareQRcodeModal';
import SearchInputView from '@/components/common/Views/SearchInputView';
import AlertDialogModal from '@/components/common/Widget/AlertDialogModal';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Box, Breadcrumbs, Button, Link, Typography } from '@mui/joy';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Chatbot, Chatbots } from './ChatbotContainer';
import PaginationView from '@/components/common/Widget/PaginationView';

import useSWRInfinite from 'swr/infinite'
import { getAllChatbotsFetcher, getChatbotsFetcher, getKey } from '../../swr/chatbot'
import type { AllChatbotsResponse } from '../../swr/chatbot'
import useSWR from 'swr'
import { getAction } from '@/swr/common';

interface ViewProps {
    chatbots: AllChatbotsResponse[] | undefined;
    handleDeleteChatbot: any;
    handleShare: any;
    qrcodeContent: any;
    visibleQRcode: boolean;
    setVisibleQRcode: any;
    anchorRef: any;
}

const fetcher = (url: any) => fetch(url).then((res) => res.json());

function ChatbotView(props: ViewProps) {
    const {
        chatbots,
        handleDeleteChatbot,
        handleShare,
        qrcodeContent,
        visibleQRcode,
        setVisibleQRcode,
        // anchorRef
    } = props;

    const router = useRouter();
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [count, setCount] = useState(0);
    const [currectChabot, setCurrectChabot] = useState<Chatbot>();


    const { data, isLoading, size, setSize, mutate } = useSWRInfinite(
        (pageIndex: number, previousPageData: AllChatbotsResponse) => {
            console.log('SWR中的page：', pageIndex)
            const url = getKey(pageIndex, previousPageData, 'searchKeywords')
            return url
        },
        getChatbotsFetcher,
    )

    useEffect(() => {
        // 监听 size 的变化
        console.log('新的 size：', size, count);
        // 在 size 变化后执行其他操作
        // ...
        setSize(size + 1)
    }, [count]);

    const anchorRef = useRef<HTMLDivElement>(null)
    const hasMore = chatbots?.at(-1)?.has_more ?? true
    useEffect(() => {
        let observer: IntersectionObserver | undefined
        if (anchorRef.current) {
            observer = new IntersectionObserver((entries) => {
                console.log('条件判定：', entries[0].isIntersecting, !isLoading, hasMore)
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    // setSize(size + 1)
                    // setSize((size: number) => size + 1)
                    setCount(count + 1)
                }
            }, { rootMargin: '100px' })
            observer.observe(anchorRef.current)
        }
        return () => observer?.disconnect()
    }, [isLoading, setSize, anchorRef, mutate, hasMore])
    // }, [isLoading, setSize, anchorRef, mutate, hasMore])
    //组件卸载或者不再需要观察元素时，调用该函数来断开 IntersectionObserver 的连接。
    //如果 observer 存在，那么调用 disconnect() 方法来断开观察器与目标元素之间的连接。

    console.log('data', data)

    // const {
    //     data,
    //     mutate,
    //     size,
    //     setSize,
    //     isValidating,
    //     isLoading } = useSWRInfinite(
    //         (index) => { return `/api/v1/chatbots?page=${index + 1}` }
    //         , getAllChatbotsFetcher)

    const chatbotArray = data?.map(obj => obj.chatbots)
    const metaArray = data?.map(obj => obj.meta)
    const issues = chatbotArray ? ([] as Chatbots[]).concat.apply([], chatbotArray) : [];
    const lastMeta = metaArray ? metaArray[-1] : [];

    const isLoadingMore =
        isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = chatbotArray?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (chatbotArray && chatbotArray[chatbotArray.length - 1]?.length < 40);


    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Breadcrumbs
                    size="sm"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon />}
                    sx={{ pl: 0 }}
                >
                    <Link underline="none" color="neutral" href="/" aria-label="Home">
                        <HomeRoundedIcon />
                    </Link>
                    <Typography color="primary" fontWeight={500} fontSize={12}>
                        助手
                    </Typography>
                </Breadcrumbs>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' },
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                }}
            >
                <Typography level="h2" component="h1">
                    智能助手
                </Typography>
                <Button
                    color="primary"
                    startDecorator={<AddIcon />}
                    size="sm"
                    onClick={() => {
                        router.push('/chatbot/edit');
                    }}
                >
                    新增助手
                </Button>
            </Box>
            <SearchInputView handleSearch={() => { }} />
            <ChatbotTable
                chatbots={issues}
                meta={lastMeta}
                handleDeleteChatbot={(chatbot: any) => {
                    setCurrectChabot(chatbot);
                    setVisibleDelete(true);
                }}
                handleShare={handleShare}
                anchorRef={anchorRef}
            />
            <ChatbotList
                chatbots={issues}
                meta={lastMeta}
                handleDeleteChatbot={(chatbot: any) => {
                    setCurrectChabot(chatbot);
                    setVisibleDelete(true);
                }}
                handleShare={handleShare}
                anchorRef={anchorRef}
            />

            <ShareQRcodeModal
                visable={visibleQRcode}
                title={'掃描QR-code來訪問智能助手'}
                name={qrcodeContent?.name}
                link={qrcodeContent?.link}
                cancelClick={() => {
                    setVisibleQRcode(false);
                }}
            />

            <AlertDialogModal
                visible={visibleDelete}
                setVisible={setVisibleDelete}
                content={`是否刪除 ${currectChabot?.name}?`}
                confirm={() => {
                    handleDeleteChatbot(currectChabot?.id);
                }}
            />
        </>
    );
}

export default ChatbotView;
