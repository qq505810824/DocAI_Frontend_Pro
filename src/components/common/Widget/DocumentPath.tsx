import axios from 'axios';
import { Box, Breadcrumbs, Link, Typography, Chip, Button, Input, Card } from '@mui/joy';
import { FolderIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import useAxios from 'axios-hooks';
import { useEffect, useState } from 'react';
import Api from '../../../apis';
import { Folder } from './FolderTree';
import FolderTreeForSelect from './FolderTreeForSelect';

interface DocumentPathProps {
    modeType: string;
    target_folder_id?: string;
    set_target_folder_id: any;
    canEditPath?: boolean;
}

const apiSetting = new Api();

export default function DocumentPath(props: DocumentPathProps) {
    const { modeType, target_folder_id, set_target_folder_id, canEditPath = true } = props;

    const [mode, setMode] = useState('');
    const [dest, setDest] = useState<Folder | null>(null);
    const [documentPath, setDocumentPath] = useState<{ id: string | null; name: string }[]>([
        { id: null, name: 'Root' }
    ]);

    const [{ data: showFolderByIDData }, showFolderByID] = useAxios({}, { manual: true });

    useEffect(() => {
        if (showFolderByIDData?.success) {
            setDocumentPath([
                { id: null, name: 'Root' },
                ...showFolderByIDData.ancestors.slice().reverse(),
                showFolderByIDData.folder
            ]);
        }
    }, [showFolderByIDData]);

    useEffect(() => {
        // if (dest?.id) {
        //     showFolderByID(apiSetting.Folders.showFolderByID(dest?.id));
        //     set_target_folder_id(dest?.id);
        // }
        if (dest?.id) {
            const fetchData = async () => {
                try {
                    const res = await apiSetting.Folders.showFolderByID(dest?.id)
                    if (res.data?.success) {
                        showFolderByID(res);
                        set_target_folder_id(dest?.id);
                    }
                } catch { }
            };
            fetchData();
        }
    }, [dest, showFolderByID]);


    useEffect(() => {
        if (target_folder_id) {
            const fetchData = async () => {
                try {
                    const res = await apiSetting.Folders.showFolderByID(target_folder_id)
                    if (res.data?.success) {
                        showFolderByID(res);
                    }
                } catch { }
            };
            fetchData();
        }
    }, [target_folder_id]);


    return (
        <>
            <Card>
                <Typography level="h2" fontSize="md">
                    儲存路徑
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }} fontSize={14}>
                        <FolderIcon className="h-6 text-blue-200 mr-1" />
                        {documentPath &&
                            documentPath.slice(0, documentPath.length - 1).map((folder) => (
                                <div key={folder.id} className="flex flex-row items-center">
                                    {folder.name}{' '}
                                    <ChevronRightIcon className="text-gray-400 text-sm h-5" />
                                </div>
                            ))}
                        {documentPath && documentPath[documentPath.length - 1].name}
                    </Box>
                    {canEditPath && (
                        <Link
                            underline="always"
                            onClick={() => {
                                setMode(modeType);
                            }}
                        >
                            編輯
                        </Link>
                    )}
                </Box>
            </Card>

            <FolderTreeForSelect
                {...{
                    mode,
                    setMode,
                    dest,
                    setDest,
                    targetId: ''
                }}
            />
        </>
    );
}
