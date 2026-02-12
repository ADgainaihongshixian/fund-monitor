import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import fundApi from '@/services/api';
import { formatDate, formatNumber, formatPercentage } from '@/utils/formatter';
import { ErrorOutline } from '@mui/icons-material';
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';

interface ChartProps {
  fundCode: string;
  fundName: string;
}

const Chart: React.FC<ChartProps> = ({ fundCode, fundName }) => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // 根据时间范围获取天数
  const getDaysFromRange = (range: string): number => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 30;
    }
  };

  // 获取历史数据
  useEffect(() => {

    const fetchHistoryData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const days = getDaysFromRange(timeRange);
        const response = await fundApi.getFundHistory(fundCode, days);

        if (response.success) {
          setHistoryData(response.data);
        } else {
          setError(response.message || '获取历史数据失败');
        }
      } catch (err) {
        setError('网络错误');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [fundCode, timeRange]);

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '0.5rem', boxShadow: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
            {formatDate(label)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'info.main', mb: 0.5 }}>
            估值: {formatNumber(payload[0].value)}
          </Typography>
          <Typography variant="body2" sx={{ color: payload[1].value >= 0 ? 'success.main' : 'error.main' }}>
            涨跌幅: {formatPercentage(payload[1].value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 12, animation: 'fadeIn 0.3s ease-in-out' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'action.hover', borderRadius: '1rem', p: 4 }}>
          <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: '50%', mb: 2 }}>
            <CircularProgress size={32} color="primary" />
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'info.main', mb: 0.5 }}>
            加载数据中...
          </Typography>
          <Typography variant="caption" sx={{ color: 'info.main' }}>
            正在获取基金历史估值数据
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 12, animation: 'fadeIn 0.3s ease-in-out' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'action.hover', borderRadius: '1rem', p: 4, textAlign: 'center', maxWidth: '400px' }}>
          <Box sx={{ bgcolor: 'error.light', p: 2, borderRadius: '50%', mb: 2 }}>
            <ErrorOutline className="h-8 w-8 text-error" />
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'error.main', mb: 1 }}>
            {error}
          </Typography>
          <Typography variant="caption" sx={{ color: 'info.main', maxWidth: '100%' }}>
            数据加载失败，请稍后重试或检查网络连接
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: '1rem', boxShadow: 1, animation: 'fadeIn 0.3s ease-in-out' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {fundName} 估值走势
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setTimeRange(range)}
                sx={{
                  textTransform: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  minWidth: '64px',
                  py: 1
                }}
              >
                {range}
              </Button>
            ))}
          </Box>
        </Box>
        <Box sx={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatDate(value).slice(5)} // 只显示月-日
                stroke="#86909C"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => formatNumber(value, 2)}
                stroke="#86909C"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatPercentage(value)}
                stroke="#86909C"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#e0e0e0', strokeWidth: 1 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => (
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {value}
                  </Typography>
                )}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="value"
                name="估值"
                stroke="#165DFF"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 8, stroke: '#165DFF', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="change"
                name="涨跌幅"
                stroke="#00B42A"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: '#00B42A', strokeWidth: 2, fill: '#ffffff' }}
                animationDuration={1500}
                animationEasing="ease-in-out"
                animationBegin={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Chart;