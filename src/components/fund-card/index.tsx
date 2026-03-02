import { formatNumber, formatPercentage } from '@/utils/formatter';
import { FundCardProps } from '@/types/fund';
import { TrendingUp, TrendingDown, Close, AccessTime, AccountBalance } from '@mui/icons-material';
import { Card, CardContent, IconButton, Badge, Typography, Box, Divider } from '@mui/material';

const FundCard = ({ fund, onRemove, onClick }: FundCardProps) => {
  const { code, name, estimateValue, estimateChange, isRising } = fund;

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
          '& .fund-card-hover-mask': {
            opacity: 1,
          },
        },
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={() => onClick?.(fund)}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.125rem', flex: 1, lineHeight: 1.3, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {name}
              </Typography>
              <Badge variant="standard" color="info" sx={{ fontSize: '0.75rem', border: '1px solid', borderColor: 'info.main', backgroundColor: 'background.paper', color: 'info.main', padding: '0 4px', borderRadius: '4px', flexShrink: 0, '& .MuiBadge-badge': { border: '1px solid', borderColor: 'info.main', backgroundColor: 'background.paper', color: 'info.main', padding: '0 4px', borderRadius: '4px' } }}>
                {code}
              </Badge>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: isRising ? 'error.main' : 'success.main' }}>
              {isRising ? <TrendingUp sx={{ height: 16, width: 16 }} /> : <TrendingDown sx={{ height: 16, width: 16 }} />}
              <Typography variant="body2" sx={{ fontWeight: 500, color: isRising ? 'error.main' : 'success.main' }}>
                {isRising ? '上涨' : '下跌'}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(code);
            }}
            sx={{
              color: 'info.main',
              '&:hover': {
                color: 'error.main',
                backgroundColor: 'action.hover',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
              ml: '4px',
              p: 0,
              borderRadius: '50%'
            }}
            aria-label="remove fund"
          >
            <Close sx={{ height: 20, width: 20 }} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box sx={{ transform: 'transition', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
            <Typography variant="body2" sx={{ color: 'info.main', mb: 0.5 }}>
              实时估值
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.5rem' }}>
                {formatNumber(estimateValue)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'info.main' }}>
                元
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right', transform: 'transition', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-2px)' }, color: isRising ? 'error.main' : 'success.main' }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              涨跌幅
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700, fontSize: '1.5rem', color: isRising ? 'error.main' : 'success.main' }}>
                {formatPercentage(estimateChange)}
              </Typography>
              <Typography variant="caption" sx={{ color: isRising ? 'error.main' : 'success.main' }}>
                {isRising ? '+' : ''}{estimateChange > 0 ? '上涨' : '下跌'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mt: 2, mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ height: 14, width: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              更新于: {fund.lastUpdate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalance sx={{ height: 14, width: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              基金
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* 悬停时的渐变效果 */}
      <Box
        className="fund-card-hover-mask"
        sx={{
          position: 'absolute',
          inset: 0,
          background: isRising ? 'linear-gradient(to bottom right, rgba(245,63,63,0.05), rgba(245,63,63,0.1))' : 'linear-gradient(to bottom right, rgba(0,180,42,0.05), rgba(0,180,42,0.1))',
          borderRadius: '1rem',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          '&:hover': {
            opacity: 1
          }
        }}
      />
    </Card>
  );
};

export default FundCard;