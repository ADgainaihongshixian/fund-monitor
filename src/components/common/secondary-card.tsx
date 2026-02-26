import { Schedule } from "@mui/icons-material";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

interface SecondaryCardProps {
    isAutoRefreshEnabled: boolean;
    lastUpdate: string | null;
    length?: number;
};

const SecondaryCard = (props: SecondaryCardProps) => {
    const { isAutoRefreshEnabled, lastUpdate, length = 0 } = props;
    return (
        <Card variant="outlined" sx={{ mb: 4, borderRadius: '0.75rem', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={3}>
                    <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: isAutoRefreshEnabled ? 'success.main' : 'text.secondary',
                                }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                自动刷新:{' '}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: isAutoRefreshEnabled ? 'success.main' : 'text.secondary' }}
                            >
                                {isAutoRefreshEnabled ? '开启' : '关闭'}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                最后更新: {lastUpdate || '未更新'}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            品种数量:{' '}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {length}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
};
export default SecondaryCard;