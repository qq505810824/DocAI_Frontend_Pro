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
import { useState } from 'react';
import { Chatbot, Chatbots } from './ChatbotContainer';
import PaginationView from '@/components/common/Widget/PaginationView';

import useSWRInfinite from 'swr/infinite'
import { getAllChatbotsFetcher } from '../../swr/chatbot'
import useSWR from 'swr'
import { getAction } from '@/swr/common';

interface ViewProps {
    chatbots: Chatbots[];
    meta: any;
    handleDeleteChatbot: any;
    handleShare: any;
    qrcodeContent: any;
    visibleQRcode: boolean;
    setVisibleQRcode: any;
}

const fetcher = (url: any) => fetch(url).then((res) => res.json());

function ChatbotView(props: ViewProps) {
    const {
        chatbots,
        meta,
        handleDeleteChatbot,
        handleShare,
        qrcodeContent,
        visibleQRcode,
        setVisibleQRcode
    } = props;

    const router = useRouter();
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [currectChabot, setCurrectChabot] = useState<Chatbot>();


    const {
        data,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading } = useSWRInfinite(
            (index) => { return `/api/v1/chatbots?page=${index + 1}` }
            , getAllChatbotsFetcher)

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
                setSize={setSize}
                size={size}
                isLoadingMore={isLoadingMore}
                isReachingEnd={isReachingEnd}
            />
            <ChatbotList
                chatbots={issues}
                meta={lastMeta}
                handleDeleteChatbot={(chatbot: any) => {
                    setCurrectChabot(chatbot);
                    setVisibleDelete(true);
                }}
                handleShare={handleShare}
                setSize={setSize}
                size={size}
                isLoadingMore={isLoadingMore}
                isReachingEnd={isReachingEnd}
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
