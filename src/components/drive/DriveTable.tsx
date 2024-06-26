/* eslint-disable jsx-a11y/anchor-is-valid */
import { DriveDocument, DriveFolder } from '@/utils/types';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, Typography } from '@mui/joy';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TableRow from './TableRow';
interface ViewProps {
    documents: DriveDocument[];
    folders: DriveFolder[];
    handleSelectedValue: any;
    setMode: Dispatch<SetStateAction<'view' | 'move' | 'share' | 'newFolder'>>;
    setTarget: Dispatch<SetStateAction<any[]>>;
    setVisableRename: any;
    setVisableDelete: any;
    setCurrent: any;
    folders_items: any;
    documents_items: any;
    setFoldersItems: any;
    setDocumentsItems: any;
    showAllItemsHandler: any;
    allDrivesData: any;
    showAllDriveLoading: boolean;
}
export default function DriveTable(props: ViewProps) {
    const {
        documents,
        folders,
        handleSelectedValue,
        setMode = () => { },
        setTarget = () => { },
        setVisableRename,
        setVisableDelete,
        setCurrent,
        folders_items,
        documents_items,
        setFoldersItems,
        setDocumentsItems,
        showAllItemsHandler,
        allDrivesData,
        showAllDriveLoading
    } = props;
    const router = useRouter();
    const [selectedValue, setSelectedValue] = React.useState<any>();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const setCheckedData = useCallback(
        (type: string, checked: boolean, value: string) => {
            if (type == 'folders') {
                const newData = checked
                    ? [...folders_items, value]
                    : folders_items.filter((_value: string) => _value !== value);
                setFoldersItems(newData);
            } else {
                const newData = checked
                    ? [...documents_items, value]
                    : documents_items.filter((_value: string) => _value !== value);
                setDocumentsItems(newData);
            }
        },
        [folders_items, documents_items, setFoldersItems, setDocumentsItems]
    );

    return (
        <React.Fragment>
            <Sheet
                className="DriveContainer"
                variant="outlined"
                sx={{
                    display: { xs: 'initial', sm: 'initial' },
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'hidden'
                }}
            >
                {(documents || folders) &&
                    [...(documents || []), ...(folders || [])].length != 0 ? (
                    <InfiniteScroll
                        dataLength={folders?.length + documents?.length} //This is important field to render the next data
                        next={showAllItemsHandler}
                        hasMore={allDrivesData?.meta?.next_page != null}
                        height={'auto'}
                        // className="max-h-[45vh] sm:max-h-[50vh]"
                        style={{ maxHeight: 500, minHeight: 300 }}
                        loader={
                            <p className="p-4 text-center">
                                <b>載入中...</b>
                            </p>
                        }
                        endMessage={<p className="p-4 text-gray-300 text-center">沒有更多資料</p>}
                    >
                        <Table
                            aria-labelledby="tableTitle"
                            stickyHeader
                            hoverRow
                            sx={{
                                // bgcolor: '#fff',
                                // '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                                '--Table-headerUnderlineThickness': '1px',
                                '--TableRow-hoverBackground':
                                    'var(--joy-palette-background-level1)',
                                '--TableCell-paddingY': '4px',
                                '--TableCell-paddingX': '8px'
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            width: '5%',
                                            textAlign: 'center',
                                            padding: '12px 6px'
                                        }}
                                    ></th>
                                    <th style={{ width: '45%', padding: '12px 6px' }}>
                                        <Typography startDecorator={<FolderIcon color="primary" />}>
                                            名稱
                                        </Typography>
                                    </th>
                                    <th style={{ width: '15%', padding: '12px 6px' }}>標籤</th>
                                    <th style={{ width: '12%', padding: '12px 6px' }}>更新日期</th>
                                    <th style={{ width: '10%', padding: '12px 6px' }}>擁有人</th>
                                    <th style={{ width: '6%', padding: '12px 6px' }}>動作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {folders.map((row: any, index) => (
                                    <TableRow
                                        key={index}
                                        doc={row}
                                        type={'folders'}
                                        setMode={setMode}
                                        setTarget={setTarget}
                                        setVisableRename={setVisableRename}
                                        setVisableDelete={setVisableDelete}
                                        setCurrent={setCurrent}
                                        selectedValue={selectedValue}
                                        setSelectedValue={setSelectedValue}
                                        handleSelectedValue={handleSelectedValue}
                                        setCheckedData={setCheckedData}
                                        checked={_.includes(folders_items, row.id)}
                                    />
                                ))}
                                {documents.map((row: any, index) => (
                                    <TableRow
                                        key={index}
                                        doc={row}
                                        type={'documents'}
                                        setMode={setMode}
                                        setTarget={setTarget}
                                        setVisableRename={setVisableRename}
                                        setVisableDelete={setVisableDelete}
                                        setCurrent={setCurrent}
                                        selectedValue={selectedValue}
                                        setSelectedValue={setSelectedValue}
                                        handleSelectedValue={handleSelectedValue}
                                        setCheckedData={setCheckedData}
                                        checked={_.includes(documents_items, row.id)}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </InfiniteScroll>
                ) : (
                    <Box display={'flex'} justifyContent={'center'} padding={2}>
                        <p className="p-4 text-center">
                            <b>
                                {allDrivesData?.success
                                    ? '沒有檔案'
                                    : showAllDriveLoading
                                        ? '載入中...'
                                        : allDrivesData?.error || ''}
                            </b>
                        </p>
                    </Box>
                )}
            </Sheet>
        </React.Fragment>
    );
}
