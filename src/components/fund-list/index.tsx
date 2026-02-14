import React from 'react';
import FundCard from '@/components/fund-card';
import { FundData } from '@/types';
import { AccountBalance, CheckCircle, Search } from '@mui/icons-material';
import { Box, Typography, Grid, Paper } from '@mui/material';

interface FundListProps {
  funds: FundData[];
  onRemoveFund: (code: string) => void;
  onFundClick?: (fund: FundData) => void;
}

const FundList: React.FC<FundListProps> = ({ funds, onRemoveFund, onFundClick }) => {

  return (
    !funds.length
      ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, animation: 'fadeIn 0.3s ease-in-out' }}>
          <Box sx={{ bgcolor: 'primary.light', p: 3, borderRadius: '1.5rem', mb: 3 }}>
            <AccountBalance className="h-16 w-16 text-primary mx-auto" />
          </Box>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5, textAlign: 'center' }}>
            还没有添加基金
          </Typography>
          <Typography variant="body1" sx={{ color: 'info.main', mb: 6, maxWidth: '400px', textAlign: 'center' }}>
            点击上方的"添加基金"按钮，输入基金代码或名称来添加您关注的基金
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            <Paper elevation={0} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: '0.75rem', borderColor: 'divider' }}>
              <CheckCircle className="h-5 w-5 text-info" />
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                输入基金代码
              </Typography>
            </Paper>
            <Paper elevation={0} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: '0.75rem', borderColor: 'divider' }}>
              <Search className="h-5 w-5 text-info" />
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                或搜索基金名称
              </Typography>
            </Paper>
          </Box>
        </Box>
      )
      : (
        <Grid container spacing={3}>
          {funds.map((fund, index) => (
            <Grid item key={fund.code} xs={12} sm={6} lg={4} xl={3} sx={{ animationDelay: `${index * 0.05}s`, animation: 'fadeIn 0.3s ease-in-out' }}>
              <FundCard
                fund={fund}
                onRemove={onRemoveFund}
                onClick={onFundClick}
              />
            </Grid>
          ))}
        </Grid>
      )
  )
};

export default FundList;