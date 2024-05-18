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
import { useState, useEffect, useRef, useCallback } from 'react';
import { Chatbot, Chatbots } from './ChatbotContainer';
import PaginationView from '@/components/common/Widget/PaginationView';

import useSWRInfinite from 'swr/infinite'
import { getAllChatbotsFetcher, getChatbotsFetcher, getKey } from '../../swr/chatbot'
import type { AllChatbotsResponse } from '../../swr/chatbot'
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
    anchorRef: any;
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
        setVisibleQRcode,
        anchorRef
    } = props;

    const router = useRouter();
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [currectChabot, setCurrectChabot] = useState<Chatbot>();


    // const chatbotArray = chatbots?.map(obj => obj.chatbots)
    // const metaArray = chatbots?.map(obj => obj.meta)
    // const issues = chatbotArray ? ([] as Chatbots[]).concat.apply([], chatbotArray) : [];
    // const lastMeta = metaArray ? metaArray[-1] : [];

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
                chatbots={chatbots}
                meta={meta}
                handleDeleteChatbot={(chatbot: any) => {
                    setCurrectChabot(chatbot);
                    setVisibleDelete(true);
                }}
                handleShare={handleShare}
                anchorRef={anchorRef}
            />
            <ChatbotList
                chatbots={chatbots}
                meta={meta}
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
