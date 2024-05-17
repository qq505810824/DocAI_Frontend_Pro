/* eslint-disable jsx-a11y/anchor-is-valid */
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';

import { Chatbots } from '@/app/chatbot/ChatbotContainer';
import PaginationView from '@/components/common/Widget/PaginationView';
import { Link, Button } from '@mui/joy';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import Dropdowns from '../feature/Dropdowns';

import useSWRInfinite from 'swr/infinite'
import { getAllChatbotsFetcher } from '../../../swr/chatbot'

interface ViewProps {
    chatbots: Chatbots[];
    meta: any;
    handleDeleteChatbot: any;
    handleShare: any;
}

export default function ChatbotList(props: ViewProps) {
    const { chatbots, meta, handleDeleteChatbot, handleShare } = props;
    const router = useRouter();

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
    const bots = chatbotArray ? ([] as Chatbots[]).concat.apply([], chatbotArray) : [];
    const lastMeta = metaArray ? metaArray[-1] : '';

    console.log(bots, lastMeta)
    // const isLoadingMore =
    //     isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    // const isEmpty = data?.[0]?.length === 0;
    // const isReachingEnd =
    //     isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

    return (
        <>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                {chatbots.map((listItem) => (
                    <List
                        key={listItem.chatbot.id}
                        size="sm"
                        sx={{
                            '--ListItem-paddingX': 0
                        }}
                    >
                        <ListItem
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start'
                            }}
                        >
                            <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                                <ListItemDecorator>
                                    <Avatar size="sm">
                                        {listItem.chatbot.name.substring(0, 1)}
                                    </Avatar>
                                </ListItemDecorator>
                                <div>
                                    <Typography fontWeight={600} gutterBottom>
                                        <Link
                                            level="title-sm"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'black'
                                            }}
                                        >
                                            <Typography
                                                onClick={() => {
                                                    handleShare(listItem.chatbot, true);
                                                }}
                                            >
                                                {listItem.chatbot.name}
                                            </Typography>
                                        </Link>
                                    </Typography>
                                    <Typography level="body-xs" gutterBottom>
                                        {listItem.chatbot.description}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 0.5,
                                            mb: 1
                                        }}
                                    >
                                        <Typography level="body-xs">
                                            {moment(listItem.chatbot?.updated_at).format(
                                                'YYYY-MM-DD HH:mm'
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 1
                                        }}
                                    >
                                        <Dropdowns
                                            share={() => {
                                                handleShare(listItem.chatbot);
                                            }}
                                            edit={() => {
                                                router.push(
                                                    `/chatbot/edit?id=${listItem.chatbot?.id}`
                                                );
                                            }}
                                            editQuesion={() => {
                                                router.push(
                                                    `/chatbot/${listItem.chatbot?.id}/assistive_question`
                                                );
                                            }}
                                            remove={() => {
                                                handleDeleteChatbot(listItem.chatbot);
                                            }}
                                        />
                                    </Box>
                                </div>
                            </ListItemContent>
                        </ListItem>
                        {/* <ListDivider /> */}
                    </List>
                ))}
                <List>
                    <ListItem>
                        <ListItemContent>
                            h????

                        </ListItemContent>
                    </ListItem>
                </List>
            </Box>
            <Box
            // sx={{ display: { xs: 'flex', md: 'flex' }, alignItems: 'center', py: 2 }}
            >
                <Button
                    color="primary"
                    // startDecorator={<AddIcon />}
                    size="sm"
                    // disabled={isLoadingMore || isReachingEnd}
                    onClick={() => {
                        setSize(size + 1)
                    }}
                >
                    Size+1
                    {/* {isLoadingMore
                        ? "loading..."
                        : isReachingEnd
                            ? "no more issues"
                            : "load more"} */}
                </Button>

                <PaginationView meta={meta} pathname={'/chatbot'} params={null} />
            </Box>
        </>
    );
}
