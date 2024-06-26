import { useState } from 'react';
import { Box, Card, Link, Typography, Chip, Button, Input } from '@mui/joy';
import DocumentPath from '../../../components/common/Widget/DocumentPath';
import Uploading from '../../../components/classification/Uploading';
import UploadOperate from '../../../components/classification/UploadOperate';
import UploadSet from '../../../components/classification/UploadSet';

interface UploadViewProps {
    formik: any;
    setDocuments: any;
    open: boolean;
    setOpen: any;
    target_folder_id?: string;
    set_target_folder_id?: any;
    getAllLabelsData?: any;
    setTagId?: any;
    needAutoUpload: boolean;
    setNeedAutoUpload: any;
    needs_deep_understanding?: boolean;
    set_needs_deep_understanding?: any;
    needs_approval?: boolean;
    set_needs_approval?: any;
    form_schema_id?: string;
    set_form_schema_id?: any;
    schemasStatusReadyData?: any;
    showUploadSet?: boolean;
    form_miniapp?: boolean;
}

function UploadView(props: UploadViewProps) {
    const {
        formik,
        setDocuments,
        open,
        setOpen,
        target_folder_id,
        set_target_folder_id,
        setTagId,
        getAllLabelsData,
        needAutoUpload,
        setNeedAutoUpload,
        needs_deep_understanding,
        set_needs_deep_understanding,
        needs_approval,
        set_needs_approval,
        form_schema_id,
        set_form_schema_id,
        schemasStatusReadyData,
        showUploadSet = true,
        form_miniapp
    } = props;
    const [myfiles, setMyFiles] = useState<any>([]);
    const [disable, setDisable] = useState(true);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Uploading {...{ open, setOpen }} />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    px: { xs: 2, md: 6 },
                    pt: {
                        xs: 'calc(12px + var(--Header-height))',
                        sm: 'calc(12px + var(--Header-height))',
                        md: 3
                    },
                    pb: { xs: 2, sm: 2, md: 3 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    gap: 1
                }}
            >
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
                        上傳文檔
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'end', width: '20%' }}>
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => {
                                formik.handleSubmit();
                            }}
                            disabled={disable}
                        >
                            上傳文檔
                        </Button>
                    </Box>
                </Box>

                <Card>
                    <UploadOperate
                        myfiles={myfiles}
                        setMyFiles={setMyFiles}
                        setDisable={setDisable}
                        setDocuments={setDocuments}
                        selectName="選擇文檔"
                        multiple={true}
                    />
                </Card>

                <DocumentPath
                    modeType={'move'}
                    target_folder_id={target_folder_id}
                    set_target_folder_id={set_target_folder_id}
                    canEditPath={!form_miniapp}
                />

                {showUploadSet && (
                    <UploadSet
                        needAutoUpload={needAutoUpload}
                        setNeedAutoUpload={setNeedAutoUpload}
                        needs_deep_understanding={needs_deep_understanding}
                        set_needs_deep_understanding={set_needs_deep_understanding}
                        set_needs_approval={set_needs_approval}
                        setTagId={setTagId}
                        set_form_schema_id={set_form_schema_id}
                        getAllLabelsData={getAllLabelsData}
                        schemasStatusReadyData={schemasStatusReadyData}
                    />
                )}
            </Box>
        </Box>
    );
}

export default UploadView;
