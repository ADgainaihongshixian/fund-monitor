import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Switch,
    Stack,
    IconButton,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Close, Info, Settings } from "@mui/icons-material";
import { TIME_INTERVAL_MAP } from '@/constant/enum';
import { SettingDialogProps } from '@/types/common';

/**
 * 设置对话框组件
 * 提供用户配置自动刷新和刷新时间间隔的功能
 */
const SettingDialog = (props: SettingDialogProps) => {
    const { isSettingsOpen, setIsSettingsOpen, autoRefresh, handleAutoRefreshToggle, refreshInterval, handleRefreshIntervalChange, tips = '开启后，系统将自动刷新贵金属行情数据' } = props;

    return (
        <Dialog
            open={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            aria-labelledby="settings-dialog-title"
            aria-describedby="settings-dialog-description"
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '1rem',
                    maxHeight: '90vh',
                },
            }}
        >
            <DialogTitle id="settings-dialog-title" sx={{ p: 3, pb: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Settings sx={{ fontSize: 24, color: 'text-info' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            设置
                        </Typography>
                    </Stack>
                    <IconButton
                        edge="end"
                        onClick={() => setIsSettingsOpen(false)}
                        aria-label="close"
                        sx={{ color: 'text.secondary' }}
                    >
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent id="settings-dialog-description" sx={{ p: 3 }}>
                <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        自动刷新
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {tips}
                        </Typography>
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <Switch
                                checked={autoRefresh}
                                onChange={handleAutoRefreshToggle}
                                color="primary"
                                size="small"
                                sx={{ marginLeft: 'auto' }}
                            />
                        </Box>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            刷新间隔
                        </Typography>
                        <Grid container spacing={2}>
                            {TIME_INTERVAL_MAP.map((seconds) => (
                                <Grid key={seconds} xs={6} sm={3}>
                                    <Button
                                        variant={refreshInterval === seconds * 1000 ? 'contained' : 'outlined'}
                                        size="small"
                                        onClick={() => handleRefreshIntervalChange(seconds)}
                                        disabled={!autoRefresh}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            width: '100%',
                                        }}
                                    >
                                        {seconds}秒
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
                            设置自动刷新的时间间隔
                        </Typography>
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                    <Info sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        提示: 频繁刷新可能会导致API调用受限
                    </Typography>
                </Stack>
            </DialogActions>
        </Dialog>
    )
};

export default SettingDialog;