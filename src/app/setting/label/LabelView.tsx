import useLoad from '@/hooks/useLoad';
import { Box, Breadcrumbs, Link, Typography } from '@mui/joy';
import Button from '@mui/joy/Button';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EditLabel from '../../../components/setting/label/EditLabel';
import LabelTable from '../../../components/setting/label/LabelTable';

import Add from '@mui/icons-material/Add';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

interface ViewProps {
    addNewLabelHandler: any;
    addNewLabelData: any;
    getAllLabelsData: {
        tags: {
            id: string;
            name: string;
            taggings_count: number;
            updated_at: string;
            created_at: string;
        }[];
    };
    setNewLabelName: any;
    newLabelName: string;
    updateLabelNameByIdHandler: any;
    tagTypes: any;
    updateTagFunctionsHandler: any;
    deleteTagFunctionsHandler: any;
    updateTagFeatureHandler: any;
}

function LabelView(props: ViewProps) {
    const {
        getAllLabelsData,
        addNewLabelHandler,
        newLabelName,
        setNewLabelName,
        updateLabelNameByIdHandler,
        tagTypes,
        updateTagFunctionsHandler,
        deleteTagFunctionsHandler,
        updateTagFeatureHandler
    } = props;
    const [sortedLabels, setSortedLabels] = useState<any[]>([]);
    const [sortedUnCheckLabels, setSortedUnCheckLabels] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [tag, setTag] = useState('');
    const router = useRouter();
    const { setLoad } = useLoad();

    const [label, setLabel] = useState<any>();
    const [chainFeatureIsOpen, setChainFeatureIsOpen] = useState(false);
    const [chain_feature_ids, set_chain_feature_ids] = useState<any>([]);
    const handleSave = (chain_feature_ids: any) => {
        updateTagFeatureHandler(label?.id, chain_feature_ids);
    };

    useEffect(() => {
        if (label) {
            set_chain_feature_ids(label?.meta?.chain_features || []);
        }
    }, [label]);

    useEffect(() => {
        if (getAllLabelsData) {
            setSortedLabels(
                _.filter(getAllLabelsData.tags, function (o: any) {
                    return o.is_checked;
                })
            );

            setSortedUnCheckLabels(
                _.filter(getAllLabelsData.tags, function (o: any) {
                    return !o.is_checked;
                })
            );
        }
    }, [getAllLabelsData]);

    return (
        <>
            <EditLabel
                {...{
                    open,
                    setOpen,
                    tag,
                    tagTypes,
                    newLabelName,
                    setNewLabelName,
                    addNewLabelHandler,
                    updateLabelNameByIdHandler,
                    updateTagFunctionsHandler,
                    deleteTagFunctionsHandler
                }}
            />
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
                        標籤管理
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
                    標籤管理
                </Typography>
                <Button
                    color="primary"
                    startDecorator={<Add />}
                    size="sm"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    新增
                </Button>
            </Box>
            {sortedLabels && (
                <LabelTable
                    labels={sortedLabels}
                    updateLabelNameByIdHandler={updateLabelNameByIdHandler}
                />
            )}
        </>
    );
}

export default LabelView;
