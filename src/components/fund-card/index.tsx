import React from 'react';
import { FundData } from '@/types';
import { formatNumber, formatPercentage } from '@/utils/formatter';
import {
  TrendingUp,
  TrendingDown,
  Close,
  AccessTime,
  AccountBalance
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  IconButton,
  Badge,
  Typography,
  Box
} from '@mui/material';

interface FundCardProps {
  fund: FundData;
  onRemove: (code: string) => void;
  onClick?: (fund: FundData) => void;
}

const FundCard: React.FC<FundCardProps> = ({ fund, onRemove, onClick }) => {
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
        },
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={() => onClick?.(fund)}
    >
      <CardContent sx={{ p: 2.5 }}>
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.125rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name}
              </Typography>
              <Badge variant="standard" color="info" sx={{ fontSize: '0.75rem', border: '1px solid', borderColor: 'info.main', backgroundColor: 'background.paper', color: 'info.main', padding: '0 4px', borderRadius: '4px', '& .MuiBadge-badge': { border: '1px solid', borderColor: 'info.main', backgroundColor: 'background.paper', color: 'info.main', padding: '0 4px', borderRadius: '4px' } }}>
                {code}
              </Badge>
            </div>
            <div className={`flex items-center gap-2 ${isRising ? 'text-danger' : 'text-success'}`}>
              {isRising ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <Typography variant="body2" sx={{ fontWeight: 500, color: isRising ? 'error.main' : 'success.main' }}>
                {isRising ? '上涨' : '下跌'}
              </Typography>
            </div>
          </div>
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
              p: '3px',
              borderRadius: '50%'
            }}
            aria-label="remove fund"
          >
            <Close className="h-4 w-4" />
          </IconButton>
        </div>

        <div className="flex justify-between items-end mb-5">
          <div className="transform transition-transform duration-300 hover:translate-y-[-2px]">
            <Typography variant="body2" sx={{ color: 'info.main', mb: 0.5 }}>
              实时估值
            </Typography>
            <div className="flex items-baseline gap-2">
              <Typography variant="h4" component="p" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.875rem' }}>
                {formatNumber(estimateValue)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'info.main' }}>
                元
              </Typography>
            </div>
          </div>
          <div className={`text-right transform transition-transform duration-300 hover:translate-y-[-2px] ${isRising ? 'text-danger' : 'text-success'}`}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              涨跌幅
            </Typography>
            <div className="flex items-baseline justify-end gap-2">
              <Typography variant="h4" component="p" sx={{ fontWeight: 700, fontSize: '1.875rem', color: isRising ? 'error.main' : 'success.main' }}>
                {formatPercentage(estimateChange)}
              </Typography>
              <Typography variant="caption" sx={{ color: isRising ? 'error.main' : 'success.main' }}>
                {isRising ? '+' : ''}{estimateChange > 0 ? '上涨' : '下跌'}
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border-color">
          <div className="flex items-center gap-2">
            <AccessTime className="h-3.5 w-3.5 text-info" />
            <Typography variant="caption" sx={{ color: 'info.main' }}>
              更新于: {fund.lastUpdate}
            </Typography>
          </div>
          <div className="flex items-center gap-1.5">
            <AccountBalance className="h-3.5 w-3.5 text-info" />
            <Typography variant="caption" sx={{ color: 'info.main' }}>
              基金
            </Typography>
          </div>
        </div>
      </CardContent>

      {/* 悬停时的渐变效果 */}
      <Box
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