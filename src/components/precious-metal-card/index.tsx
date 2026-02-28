import { usePreciousMetalData } from '@/hooks/usePreciousMetalData';
import { PreciousMetalCardProps } from '@/types/preciousMetal';
import { calculateCnyPrice } from '@/utils/calculateCnyPrice';
import {
  TrendingUp,
  TrendingDown,
  AccessTime,
  ShowChart,
  AttachMoney,
  ArrowUpward,
  ArrowDownward,
  Diamond,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Grid,
  Chip,
  Divider,
} from '@mui/material';

const PreciousMetalCard = ({ metal }: PreciousMetalCardProps) => {
  const { name, nameEn, currentPrice, openPrice, highPrice, lowPrice, prevClosePrice, change, changePercent, lastUpdate, isRising } = metal;
  const { exchangeRate } = usePreciousMetalData();

  const priceMaps = [
    { label: '开盘价', value: openPrice.toFixed(2), icon: <ShowChart sx={{ fontSize: 16, color: 'text.secondary' }} /> },
    { label: '昨收价', value: prevClosePrice.toFixed(2), icon: <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} /> },
    { label: '最高价', value: highPrice.toFixed(2), icon: <ArrowUpward sx={{ fontSize: 16, color: 'error.main' }} /> },
    { label: '最低价', value: lowPrice.toFixed(2), icon: <ArrowDownward sx={{ fontSize: 16, color: 'success.main' }} /> },
  ];

  return (
    <Card
      sx={{
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          borderColor: 'primary.light',
          transform: 'translateY(-2px)',
          '& .hover-mask': {
            opacity: 1,
          },
        },
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', alignContent: 'center', gap: 1, mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.125rem' }}
              >
                {name}
              </Typography>
              <Chip
                label={nameEn}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.75rem',
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              {isRising ?
                <TrendingUp sx={{ fontSize: 16, color: 'error.main' }} />
                :
                <TrendingDown sx={{ fontSize: 16, color: 'success.main' }} />
              }
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: isRising ? 'error.main' : 'success.main' }}
              >
                {isRising ? '上涨' : '下跌'}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              当前价格：
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                美元/盎司 （人民币/克）
              </Typography>
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography
                variant="h4"
                component="p"
                sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.75rem' }}
              >
                {currentPrice.toFixed(2)}
              </Typography>
              {!!exchangeRate?.rate &&
                <Stack direction="row" alignItems="center">
                  <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontSize: 14, fontWeight: 500 }}>
                    （￥{calculateCnyPrice(exchangeRate.rate, currentPrice)}）
                  </Typography>
                </Stack>
              }
            </Stack>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              涨跌幅
            </Typography>
            <Stack direction="row" alignItems="baseline" justifyContent="flex-end" spacing={0.5}>
              {isRising ? (
                <ArrowUpward sx={{ fontSize: 16, color: 'error.main' }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 16, color: 'success.main' }} />
              )}
              <Typography
                variant="h5"
                component="p"
                sx={{ fontWeight: 700, fontSize: '1.5rem', color: isRising ? 'error.main' : 'success.main' }}
              >
                {isRising ? '+' : ''}{changePercent.toFixed(2)}%
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: isRising ? 'error.main' : 'success.main' }}>
              {isRising ? '+' : ''}{change}
              {!!exchangeRate?.rate && `（￥${calculateCnyPrice(exchangeRate.rate, change)}）`}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={1}>
          {priceMaps.map((item, index) => {
            const { label, value, icon } = item
            return (
              <Grid item xs={6} key={item.label} sx={{ display: 'flex' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ marginLeft: index % 2 !== 0 ? 'auto' : 'unset' }}>
                  {icon}
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', display: 'flex', alignItems: 'end' }}>
                      {value}
                      {!!exchangeRate?.rate &&
                        <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 500 }}>
                          （￥{calculateCnyPrice(exchangeRate.rate, +value)}）
                        </Typography>
                      }
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            )
          })}
        </Grid>

        <Divider sx={{ mt: 2, mb: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              更新于: {lastUpdate}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Diamond sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              贵金属
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <Box
        className="hover-mask"
        sx={{
          position: 'absolute',
          inset: 0,
          background: isRising
            ? 'linear-gradient(to bottom right, rgba(245,63,63,0.05), rgba(245,63,63,0.1))'
            : 'linear-gradient(to bottom right, rgba(0,180,42,0.05), rgba(0,180,42,0.1))',
          borderRadius: '1rem',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />
    </Card>
  );
};

export default PreciousMetalCard;
