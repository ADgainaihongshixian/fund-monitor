import PreciousMetalCard from '@/components/precious-metal-card';
import { PreciousMetalListProps } from '@/types/preciousMetal';
import { Diamond } from '@mui/icons-material';
import { Box, Grid, Typography, Paper } from '@mui/material';

/**
 * 贵金属列表组件
 * 展示用户添加的贵金属卡片列表，支持删除和点击操作
 */
const PreciousMetalList = ({ metals }: PreciousMetalListProps) => {
  return (
    !!metals.length ?
      <Grid container spacing={3}>
        {metals.map((metal, index) => (
          <Grid
            item
            key={metal.symbol}
            xs={12}
            sm={6}
            md={6}
            lg={4}
            sx={{ animationDelay: `${index * 0.05}s`, animation: 'fadeIn 0.3s ease-in-out' }}
          >
            <PreciousMetalCard metal={metal} />
          </Grid>
        ))}
      </Grid>
      :
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, animation: 'fadeIn 0.3s ease-in-out' }}>
        <Box sx={{ bgcolor: 'action.hover', p: 3, borderRadius: '1.5rem', mb: 3 }}>
          <Diamond sx={{ fontSize: 64, color: 'text.disabled' }} />
        </Box>
        <Typography
          variant="h5"
          component="h3"
          sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5, textAlign: 'center' }}
        >
          暂无贵金属数据
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: 6, maxWidth: '400px', textAlign: 'center' }}
        >
          请点击刷新按钮获取最新行情
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: '0.75rem', borderColor: 'divider' }}>
            <Diamond sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              伦敦金、伦敦银
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: '0.75rem', borderColor: 'divider' }}
          >
            <Diamond sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              铂金、钯金期货
            </Typography>
          </Paper>
        </Box>
      </Box>
  );
};

export default PreciousMetalList;