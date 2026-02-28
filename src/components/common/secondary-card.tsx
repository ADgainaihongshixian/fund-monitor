import { CurrencyExchange, Schedule } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { SecondaryCardProps } from "@/types/common";

const SecondaryCard = (props: SecondaryCardProps) => {
    const { isAutoRefreshEnabled, lastUpdate, length = 0, rate = 0 } = props;
    return (
        <Card variant="outlined" sx={{ mb: 4, borderRadius: '0.75rem', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={3}>
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
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
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                品种数量:{' '}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {length}
                            </Typography>
                        </Stack>

                        {!!rate && <Stack direction="row" alignItems="center" spacing={1}>
                            <CurrencyExchange sx={{ fontSize: 20, color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                实时汇率：
                            </Typography>
                            <Chip
                                label={`1 USD = ${rate} CNY`}
                                size="small"
                                sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, height: 24 }}
                            />
                        </Stack>}

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                最后更新:{' '}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {lastUpdate || '未更新'}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
};
export default SecondaryCard;